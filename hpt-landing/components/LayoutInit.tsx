'use client';

import { useEffect } from 'react';

import { useLayoutStore, DESKTOP_MEDIA_QUERY } from '@/stores/layoutStore';

export default function LayoutInit() {
  const setIsDesktop = useLayoutStore((s) => s.setIsDesktop);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, [setIsDesktop]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-gtm-event]',
      );
      if (!target) return;

      const prefix = 'data-gtm-';
      const params: Record<string, string> = {};
      for (const attr of target.getAttributeNames()) {
        if (attr.startsWith(prefix) && attr !== 'data-gtm-event') {
          const paramKey = attr.slice(prefix.length);
          params[paramKey] = target.getAttribute(attr) as string;
        }
      }

      const data = {
        event: target.dataset.gtmEvent as string,
        ...params,
      };

      console.log('[GTM]', data.event, params);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(data);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
