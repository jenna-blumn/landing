import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ClientIndustrySection.style';
import { CLIENT_INDUSTRIES } from '@/constants/client';

const INTERVAL_MS = 5000;

export default function ClientIndustrySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CLIENT_INDUSTRIES.length);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.titleArea}>
          <h2 css={styles.title}>업종에 구분없이, 맞춤 서비스로 이용하세요</h2>
          <p css={styles.subtitle}>
            비슷한 업종의 기업들이 해피톡을 통해 고객상담의 품질을 높이고 있는
            방법을 확인해보세요.
          </p>
        </div>

        <div css={styles.content}>
          <div css={styles.accordion}>
            {CLIENT_INDUSTRIES.map((item, index) => (
              <div
                key={item.id}
                css={styles.accordionItem(activeIndex === index)}
                onClick={() => handleClick(index)}
              >
                <div css={styles.accordionTitle(activeIndex === index)}>
                  {item.title}
                </div>
                {activeIndex === index && (
                  <div css={styles.accordionContent}>
                    <p css={styles.accordionDescription}>{item.description}</p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={styles.accordionLink}
                    >
                      더 알아보기 →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div css={styles.imageArea}>
            {CLIENT_INDUSTRIES.map((item, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                css={styles.industryImage(activeIndex === index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
