'use client';

import { useState, useEffect } from 'react';
import styles from './SecondGuide.style';

import ScenarioContent from '@/components/agent/ScenarioContent';

import SecondGuideLineSvg from '@/assets/svg/second-guide-line.svg';
import SecondGuideLineMobileSvg from '@/assets/svg/second-guide-line_mobile.svg';
import BrandIcon from '@/assets/svg/brand-icon_s128.svg';
import GradientText from '@/components/ui/GradientText';
import SparkleIcon from '@/assets/svg/sparkle-icon_s18.svg';
import { IVY_WORKFLOW_SLIDE_TEXT } from '@/constants/interaction';
import useViewObserver from '@/hooks/useViewObserver';

const INITIAL_DELAY = 700;
const AFTER_TYPING_DELAY = 650;
const ANIMATION_DURATION = 500;
const TYPING_SPEED = 20;

interface Props {
  isInView: boolean;
  isMobile?: boolean;
}

export default function SecondGuide({ isInView, isMobile }: Props) {
  const { ref: containerRef, isInView: isVisible } = useViewObserver({
    threshold: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [typedLength, setTypedLength] = useState(0);

  const currentDescription = IVY_WORKFLOW_SLIDE_TEXT[currentIndex].description;
  const nextIndex = (currentIndex + 1) % IVY_WORKFLOW_SLIDE_TEXT.length;
  const LineSvg = isMobile ? SecondGuideLineMobileSvg : SecondGuideLineSvg;

  // 초기 딜레이
  useEffect(() => {
    if (!isInView) {
      setIsReady(false);
      setCurrentIndex(0);
      setIsAnimating(false);
      setTypedLength(0);
      return;
    }

    const delayTimer = setTimeout(() => {
      setIsReady(true);
    }, INITIAL_DELAY);

    return () => clearTimeout(delayTimer);
  }, [isInView]);

  useEffect(() => {
    if (!isReady || isAnimating || !isVisible) return;
    if (typedLength < currentDescription.length) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % IVY_WORKFLOW_SLIDE_TEXT.length);
        setIsAnimating(false);
        setTypedLength(0);
      }, ANIMATION_DURATION);
    }, AFTER_TYPING_DELAY);

    return () => clearTimeout(timer);
  }, [isReady, isAnimating, isVisible, typedLength, currentDescription]);

  useEffect(() => {
    if (!isReady || isAnimating || !isVisible) return;

    if (typedLength < currentDescription.length) {
      const timer = setTimeout(() => {
        setTypedLength((prev) => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    }
  }, [isReady, isAnimating, isVisible, typedLength, currentDescription]);

  return (
    <div css={styles.container} ref={containerRef}>
      {isInView && (
        <div css={styles.wrapper}>
          <div css={styles.scenarioWrapper}>
            <ScenarioContent
              isSecondGuide
              isUsingAnimation={false}
              top={isMobile ? -164 : -96}
              isMobile={isMobile}
            />
            <LineSvg css={styles.lineSvg} />
            <div css={styles.brandIcon}>
              <BrandIcon />
              <GradientText
                colors={['#76C6FF', '#97FFA9', '#D8FF6F']}
                animationSpeed={2}
                showBorder={false}
                className="gradient-text"
              >
                해피톡 AI 실행
              </GradientText>
            </div>
          </div>
          <div css={styles.slideText}>
            <div css={styles.bubble}>
              <div css={styles.bubbleRow}>
                <SparkleIcon />
                <div css={styles.processWrapper}>
                  <div css={styles.processSlider(isAnimating)}>
                    <p css={styles.processText(false)}>
                      {IVY_WORKFLOW_SLIDE_TEXT[currentIndex].process}
                    </p>
                    <p css={styles.processText(true)}>
                      {IVY_WORKFLOW_SLIDE_TEXT[nextIndex].process}
                    </p>
                  </div>
                </div>
              </div>
              <p css={styles.descriptionText}>
                {currentDescription.slice(0, typedLength)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
