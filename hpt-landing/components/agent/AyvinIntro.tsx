import styles from './AyvinIntro.style';

import BrandIcon from '@/assets/svg/brand-icon_s110.svg';
import ArrowRightUpIcon from '@/assets/svg/arrow-right-up.svg';
import common from '@/styles/common';

export default function AyvinIntro() {
  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.titleSection}>
          <BrandIcon />
          <h2>
            AI로 상담의 흐름을
            <br />
            처음부터 끝까지 연결합니다
          </h2>
          {/* <p>
            에이빈은 기능 이름이 아닌, 고객 경험의 연결끈을 끝까지 붙잡겠다는
            약속입니다.
          </p> */}
        </div>
        <div css={styles.introSection} data-header-theme="dark">
          <div css={[styles.introItem, styles.firstItem]}>
            <h2>
              해피톡 AI 에이전트의
              <br />
              이야기
            </h2>
            <div css={styles.introItemDescription}>
              <span>
                해피톡 AI는 어디서든 자라나고 한 번 이어진 것을 쉽게 놓지 않는
                담쟁이덩굴과 같습니다.
              </span>
              <br />
              고객의 의도를 끊지 않고, 상담의 흐름을 끊지 않고,{' '}
              <br css={common.desktopBr} />
              경험의 연결끈을 끝까지 붙잡습니다.
            </div>
            <div css={styles.introItemImageWrapper()}>
              <div css={styles.introItemImage(true)} />
            </div>
            <a
              href="https://blog.blumn.ai/ai-agent-brand-story"
              target="_blank"
              rel="noopener noreferrer"
              css={styles.introItemArrowButton}
              data-gtm-event="AGENT_DETAILS"
            >
              <ArrowRightUpIcon />
            </a>
          </div>
          <div css={[styles.introItem, styles.secondItem]}>
            <h2>
              해피톡 AI 지식베이스의
              <br />
              차별점
            </h2>
            <div css={styles.introItemDescription}>
              <span>문서 저장만 하는 기존 지식베이스와 다릅니다.</span>
              <br />
              AI가 고객과의 연결을 끊지 않도록 붙잡아주는 지식 워크페이스의
              일부가 됩니다.
            </div>
            <div css={styles.introItemImageWrapper(229)}>
              <div css={styles.introItemImage(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
