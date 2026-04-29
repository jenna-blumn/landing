import { useEffect, useState } from 'react';
import styles from './MobileInteraction.style';

import MobileFirstGuide from '@/components/agent/mobile/MobileFirstGuide';
import MobileSecondGuide from '@/components/agent/mobile/MobileSecondGuide';
import MobileThirdGuide from '@/components/agent/mobile/MobileThirdGuide';
import MobileFourthGuide from '@/components/agent/mobile/MobileFourthGuide';
import GradientText from '@/components/ui/GradientText';

import useViewObserver from '@/hooks/useViewObserver';
import { INTERACTION_ITEMS } from '@/constants/interaction';

const SCENARIO_DESKTOP_QUERY = '(min-width: 961px)';

const mobileGuides = [
  MobileFirstGuide,
  MobileSecondGuide,
  MobileThirdGuide,
  MobileFourthGuide,
];

const items = INTERACTION_ITEMS.map((textItem, index) => ({
  textItem,
  MobileGuide: mobileGuides[index],
}));

export default function MobileInteraction() {
  const options = { threshold: 1, once: true };
  const [isScenarioDesktop, setIsScenarioDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(SCENARIO_DESKTOP_QUERY);
    setIsScenarioDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsScenarioDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { ref: ref1, isInView: isInView1 } = useViewObserver(options);
  const { ref: ref2, isInView: isInView2 } = useViewObserver(options);
  const { ref: ref3, isInView: isInView3 } = useViewObserver(options);
  const { ref: ref4, isInView: isInView4 } = useViewObserver(options);

  const refs = [ref1, ref2, ref3, ref4];
  const rawIsInViews = [isInView1, isInView2, isInView3, isInView4];

  return (
    <div css={styles.wrapper}>
      <h2>
        <GradientText
          colors={['#2F9BFF', '#63F169', '#DEEF26']}
          animationSpeed={2}
          showBorder={false}
          className="gradient-text"
        >
          해피톡 AI 에이전트
        </GradientText>
        는<br />
        이래서 특별합니다
      </h2>
      {items.map((item, index) => (
        <div key={index} css={styles.item} ref={refs[index]}>
          <div css={styles.textItem}>
            {item.textItem.title.split('\n').map((line, lineIndex) => (
              <h3 css={styles.textItemTitle} key={lineIndex}>
                {line}
              </h3>
            ))}
            <p css={styles.textItemDescription}>
              {item.textItem.description.replace(/\n/g, ' ')}
            </p>
          </div>
          <div css={styles.guideWrapper(rawIsInViews[index])}>
            <item.MobileGuide
              isInView={rawIsInViews[index]}
              isScenarioDesktop={isScenarioDesktop}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
