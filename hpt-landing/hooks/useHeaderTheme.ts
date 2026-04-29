import { useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderTheme } from '@/models/main';

const HEADER_HEIGHT = 60;

function isInHeaderArea(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < HEADER_HEIGHT && rect.bottom > 0;
}

export default function useHeaderTheme(): HeaderTheme | null {
  const [theme, setTheme] = useState<HeaderTheme | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const blurSections = document.querySelectorAll(
      '[data-header-theme="blur"]',
    );
    if (blurSections.length === 0) {
      setTheme(HeaderTheme.LIGHT);
      return;
    }

    // 동기적으로 초기 테마 판정 (paint 전에 실행되어 깜빡임 방지)
    const hasVisibleBlur = Array.from(blurSections).some(isInHeaderArea);
    setTheme(hasVisibleBlur ? HeaderTheme.BLUR : HeaderTheme.LIGHT);

    const visibleSet = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target);
          } else {
            visibleSet.delete(entry.target);
          }
        });
        setTheme(visibleSet.size > 0 ? HeaderTheme.BLUR : HeaderTheme.LIGHT);
      },
      {
        rootMargin: `0px 0px -${window.innerHeight - HEADER_HEIGHT}px 0px`,
        threshold: 0,
      },
    );

    blurSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return theme;
}
