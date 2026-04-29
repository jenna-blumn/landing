import { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import styles from './ClientFeaturedSection.style';
import { CLIENT_FEATURED } from '@/constants/client';

export default function ClientFeaturedSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (overlayIndex !== null) return;

      setOverlayIndex(index);
      setTimeout(() => {
        swiperInstance?.slideToLoop(index, 0);
        setOverlayIndex(null);
      }, 400);
    },
    [swiperInstance, overlayIndex],
  );

  const handleDotClick = (index: number) => {
    if (index === activeIndex || overlayIndex !== null) return;
    goToSlide(index);
  };

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % CLIENT_FEATURED.length;
      goToSlide(nextIndex);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [activeIndex, goToSlide]);

  const overlayItem =
    overlayIndex !== null ? CLIENT_FEATURED[overlayIndex] : null;

  return (
    <section css={styles.container}>
      <div css={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation]}
          loop
          slidesPerView={1}
          css={styles.swiper}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
        >
          {CLIENT_FEATURED.map((item) => (
            <SwiperSlide key={item.id}>
              <div css={styles.card}>
                <img
                  src={item.image}
                  alt={item.companyName}
                  css={styles.cardImage}
                />
                <div css={styles.cardContent}>
                  <div css={styles.badge}>{item.badge}</div>
                  <h3 css={styles.companyName}>{item.companyName}</h3>
                  <p css={styles.description}>
                    {item.description.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    css={styles.ctaButton}
                  >
                    <span>이야기 읽기</span>
                    <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {overlayItem && (
          <div css={styles.overlay(true)}>
            <div css={styles.card}>
              <img
                src={overlayItem.image}
                alt={overlayItem.companyName}
                css={styles.cardImage}
              />
              <div css={styles.cardContent}>
                <div css={styles.badge}>{overlayItem.badge}</div>
                <h3 css={styles.companyName}>{overlayItem.companyName}</h3>
                <p css={styles.description}>
                  {overlayItem.description.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <a
                  href={overlayItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.ctaButton}
                >
                  <span>이야기 읽기</span>
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div css={styles.dotsContainer}>
        {CLIENT_FEATURED.map((_, index) => (
          <div key={index} onClick={() => handleDotClick(index)}>
            <span className={activeIndex === index ? 'active' : ''} />
          </div>
        ))}
      </div>
    </section>
  );
}
