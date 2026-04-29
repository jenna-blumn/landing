'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import styles from './ExperienceSection.style';
import { EXPERIENCE_TAB_LABELS, EXPERIENCE_TABS } from '@/constants/main';
import { useLayoutStore } from '@/stores/layoutStore';
import LeftDirectionIcon from '@/assets/svg/left-direction_s16.svg';
import CheckIcon from '@/assets/svg/check-icon_s14.svg';

export default function ExperienceSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useLayoutStore((state) => state.isDesktop);

  if (isDesktop === null) return null;

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === EXPERIENCE_TABS.length - 1;

  const slideWidth = isDesktop ? 890 : 320;
  const spaceBetween = isDesktop ? 20 : 12;
  const slidesOffset = isDesktop ? 0 : 40;
  // const onClickTab = (index: number) => {
  //   swiperRef.current?.slideTo(index);
  // };

  const onClickPrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    setActiveIndex(newIndex);
    swiperRef.current?.slideTo(newIndex);
  };

  const onClickNext = () => {
    const newIndex = Math.min(EXPERIENCE_TABS.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    swiperRef.current?.slideTo(newIndex);
  };

  const getMostVisibleIndex = (swiper: SwiperType) => {
    const offset = Math.abs(swiper.translate);
    const viewEnd = offset + swiper.width;
    let activeIdx = 0;
    let maxVisible = 0;

    for (let i = 0; i < swiper.slides.length; i++) {
      const slideStart = swiper.slidesGrid[i];
      const slideEnd = slideStart + swiper.slidesSizesGrid[i];
      const visible = Math.max(
        0,
        Math.min(viewEnd, slideEnd) - Math.max(offset, slideStart),
      );
      if (visible > maxVisible) {
        maxVisible = visible;
        activeIdx = i;
      }
    }
    return activeIdx;
  };

  const onTransitionEnd = (swiper: SwiperType) => {
    setActiveIndex(getMostVisibleIndex(swiper));
  };

  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.textBox}>
          <h2>
            그래서,{' '}
            <span>
              {EXPERIENCE_TAB_LABELS[EXPERIENCE_TABS[activeIndex].id]} 입장에서
            </span>{' '}
            <br />
            해피톡 AI를 쓰면
            <br />
            무엇이 달라질까요?
          </h2>
          {/* <div css={styles.tabsContainer}>
            <div css={styles.tabs}>
              {EXPERIENCE_TABS.map((tab, index) => (
                <div
                  key={tab.id}
                  css={styles.tab(activeIndex === index)}
                  onClick={() => onClickTab(index)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div css={styles.experienceContainer}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onTransitionEnd={onTransitionEnd}
            slidesPerView="auto"
            spaceBetween={spaceBetween}
            slidesOffsetAfter={slidesOffset}
            css={styles.swiper}
          >
            {EXPERIENCE_TABS.map((tab) => (
              <SwiperSlide key={tab.id} style={{ width: slideWidth }}>
                <div css={styles.experienceContent(tab.image.src)}>
                  <div css={styles.blurBackground} />
                  <div css={styles.textContent}>
                    <div css={styles.title}>
                      <h2>{tab.title}</h2>
                    </div>
                    <div css={styles.pointContainer}>
                      {tab.points.map((point, index) => (
                        <div key={index}>
                          <CheckIcon />
                          <p>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div css={styles.pagination}>
          <button onClick={onClickPrev} disabled={isFirst}>
            <LeftDirectionIcon />
          </button>
          <button onClick={onClickNext} disabled={isLast}>
            <LeftDirectionIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
