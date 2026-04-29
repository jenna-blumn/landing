import { useEffect, useState } from 'react';

import styles from './DesktopInteraction.style';

import FirstGuide from '@/components/agent/FirstGuide';
import SecondGuide from '@/components/agent/SecondGuide';
import RoutingGuide from '@/components/agent/RoutingGuide';
import GradientText from '@/components/ui/GradientText';

import useViewObserver from '@/hooks/useViewObserver';
import { INTERACTION_ITEMS } from '@/constants/interaction';

const guides = [
  { Guide: FirstGuide },
  { Guide: SecondGuide },
  { Guide: RoutingGuide, isAiRoute: true },
  { Guide: RoutingGuide, isAiRoute: false },
];

const items = INTERACTION_ITEMS.map((textItem, index) => ({
  textItem,
  ...guides[index],
}));

export default function DesktopInteraction() {
  const options = { threshold: 1 };

  const { ref: sectionRef, isInView: isSectionInView } = useViewObserver({
    threshold: 0,
  });
  const { ref: ref1, isInView: isInView1 } = useViewObserver({
    threshold: 0,
  });
  const { ref: ref2, isInView: isInView2 } = useViewObserver(options);
  const { ref: ref3, isInView: isInView3 } = useViewObserver(options);
  const { ref: ref4, isInView: isInView4 } = useViewObserver(options);

  const refs = [ref1, ref2, ref3, ref4];
  const rawIsInViews = [isInView1, isInView2, isInView3, isInView4];

  const [lastActive, setLastActive] = useState(-1);
  const activeIndex = rawIsInViews.lastIndexOf(true);

  const currentIndex =
    activeIndex !== -1 ? activeIndex : isSectionInView ? lastActive : -1;
  const isInViews = rawIsInViews.map((_, index) => index === currentIndex);

  useEffect(() => {
    if (activeIndex !== -1) setLastActive(activeIndex);
  }, [activeIndex]);

  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.textSection} ref={sectionRef}>
          {items.map((item, index) => (
            <div
              key={index}
              css={styles.textItemWrapper(index === 0)}
              ref={refs[index]}
            >
              {index === 0 && (
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
              )}
              <div>
                {item.textItem.title.split('\n').map((line, lineIndex) => (
                  <h3 css={styles.textItemTitle} key={lineIndex}>
                    {line}
                  </h3>
                ))}
                {item.textItem.description
                  .split('\n')
                  .map((line, lineIndex) => (
                    <p css={styles.textItemDescription} key={lineIndex}>
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div css={styles.imgSection}>
          <div css={styles.imgWrapper}>
            {items.map((item, index) => (
              <div key={index} css={styles.img(isInViews[index])}>
                <item.Guide
                  isInView={isInViews[index]}
                  {...('isAiRoute' in item && { isAiRoute: item.isAiRoute })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
