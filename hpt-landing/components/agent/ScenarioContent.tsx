import { useMemo } from 'react';

import { createStyles } from './ScenarioContent.style';

import LoaderIcon from '@/assets/svg/loader-icon_s14.svg';
import FirstScenarioSvg from '@/assets/svg/scenario-first.svg';
import SecondScenarioSvg from '@/assets/svg/scenario-second.svg';
import ThirdScenarioSvg from '@/assets/svg/scenario-third.svg';
import FourthScenarioGradientSvg from '@/assets/svg/scenario-fourth-gradient.svg';
import FourthScenarioGradientMobileSvg from '@/assets/svg/scenario-fourth-gradient_mobile.svg';
import FourthScenarioSvg from '@/assets/svg/scenario-fourth.svg';
import FifthScenarioSvg from '@/assets/svg/scenario-fifth.svg';
import FirstLineSvg from '@/assets/svg/scenario-first-line.svg';
import FirstLineMobileSvg from '@/assets/svg/scenario-first-line_mobile.svg';
import SecondLineSvg from '@/assets/svg/scenario-second-line.svg';
import SecondLineMobileSvg from '@/assets/svg/scenario-second-line_mobile.svg';
import ThirdLineSvg from '@/assets/svg/scenario-third-line.svg';
import FourthLineSvg from '@/assets/svg/scenario-fourth-line.svg';
import FifthLineSvg from '@/assets/svg/scenario-fifth-line.svg';
import ThirdLineMobileSvg from '@/assets/svg/scenario-third-line_mobile.svg';

interface ScenarioContentProps {
  isUsingAnimation?: boolean;
  isSecondGuide?: boolean;
  top?: number;
  isMobile?: boolean;
}

export default function ScenarioContent({
  isUsingAnimation = true,
  isSecondGuide = false,
  top,
  isMobile = false,
}: ScenarioContentProps) {
  const GradientSvg = isMobile
    ? FourthScenarioGradientMobileSvg
    : FourthScenarioGradientSvg;

  const styles = useMemo(
    () => createStyles(isUsingAnimation, isSecondGuide),
    [isUsingAnimation, isSecondGuide],
  );

  return (
    <div css={styles.scenarioWrapper(top)}>
      <div css={styles.scenarioHeader}>
        <div css={styles.tabUI}>워크플로우 시나리오</div>
        <div css={styles.badgeUI}>
          <LoaderIcon />
          <span>시나리오 상담 진행</span>
        </div>
      </div>
      <div css={styles.container}>
        <div css={styles.wrapper}>
          <span css={styles.startText}>시나리오 시작</span>
          {isMobile ? (
            <>
              <FirstLineMobileSvg css={styles.firstMobileLine} />
              <FirstScenarioSvg css={styles.firstMobileScenarioSvg} />
              <SecondLineMobileSvg css={styles.secondMobileLine} />
              <SecondScenarioSvg css={styles.secondMobileScenarioSvg} />
              <ThirdLineMobileSvg css={styles.thirdMobileLine} />
              {!isSecondGuide && (
                <FourthScenarioSvg css={styles.thirdMobileScenarioSvg} />
              )}
            </>
          ) : (
            <>
              <FirstLineSvg css={styles.firstLine} />
              <FirstScenarioSvg css={styles.firstScenarioSvg} />
              <SecondLineSvg css={styles.secondLine} />
              <SecondScenarioSvg css={styles.secondScenarioSvg} />
              <ThirdLineSvg css={styles.thirdLine} />
              <ThirdScenarioSvg css={styles.thirdScenarioSvg} />
              <FourthLineSvg css={styles.fourthLine} />
              {!isSecondGuide && (
                <FourthScenarioSvg css={styles.fourthScenarioSvg} />
              )}
              <FifthLineSvg css={styles.fifthLine} />
              <FifthScenarioSvg css={styles.fifthScenarioSvg} />
              <div css={styles.blur} />
            </>
          )}
        </div>
        {isSecondGuide && (
          <GradientSvg
            css={[
              isMobile
                ? styles.thirdMobileScenarioGradientSvg
                : styles.fourthScenarioSvg,
            ]}
          />
        )}
      </div>
    </div>
  );
}
