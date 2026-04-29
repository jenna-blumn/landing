import React, { useEffect, useRef, useState } from 'react';

import styles from './RoutingGuideBlock.style';

import RoutingGuideAILineSvg from '@/assets/svg/routing-guide-ai-line.svg';
import RoutingGuideAILineMobileSvg from '@/assets/svg/routing-guide-ai-line_mobile.svg';
import RoutingGuideCounselorLineSvg from '@/assets/svg/routing-guide-counselor-line.svg';
import RoutingGuideCounselorLineMobileSvg from '@/assets/svg/routing-guide-counselor-line_mobile.svg';

import HaiIcon from '@/assets/svg/hai-icon_s14.svg';
import HeadsetIcon from '@/assets/svg/headset-icon_s14.svg';

interface Props {
  isAyvin: boolean;
  isRoute: boolean;
  isThinking?: boolean;
  isMobile?: boolean;
}

const TOTAL_TYPING_DURATION = 1500;
const CHAT_CONTAINER_ANIMATION_DELAY = 1300;

const counselorMessage = '정확한 상담을 위해 상담원을 연결해드리겠습니다.';
const aiMessage = [
  '상품이 어제 배송되었고 택을 제거하지 않은 상태라면 대부분의 상품은 반품이 가능합니다.',
  '다만, 상품별 반품 기준이 다를 수 있어 주문번호를 알려주시면 반품 가능 여부와 절차를 자세히 안내드리겠습니다.',
];

export default function RoutingGuideBlock({
  isAyvin = true,
  isRoute,
  isThinking,
  isMobile = false,
}: Props) {
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [aiCharIndex, setAiCharIndex] = useState(0);

  const chatInnerRef = useRef<HTMLDivElement>(null);

  const totalAiChars = aiMessage.join('').length;

  useEffect(() => {
    if (isAyvin || !isRoute) {
      setIsTypingStarted(false);
      setCharIndex(0);
      return;
    }

    const charDelay = TOTAL_TYPING_DURATION / counselorMessage.length;
    let intervalId: NodeJS.Timeout | null = null;

    const startTimeout = setTimeout(() => {
      setIsTypingStarted(true);

      intervalId = setInterval(() => {
        setCharIndex((prev) => {
          if (prev < counselorMessage.length) {
            return prev + 1;
          }
          if (intervalId) clearInterval(intervalId);
          return prev;
        });
      }, charDelay);
    }, CHAT_CONTAINER_ANIMATION_DELAY);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAyvin, isRoute]);

  useEffect(() => {
    if (!isAyvin || !isRoute || isThinking) {
      setAiCharIndex(0);

      return;
    }

    const charDelay = TOTAL_TYPING_DURATION / totalAiChars;
    let intervalId: NodeJS.Timeout | null = null;

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setAiCharIndex((prev) => {
          if (prev < totalAiChars) {
            return prev + 1;
          }
          if (intervalId) clearInterval(intervalId);

          return prev;
        });
      }, charDelay);
    }, 0);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAyvin, isRoute, isThinking, totalAiChars]);

  const displayedText = isTypingStarted
    ? counselorMessage.slice(0, charIndex)
    : null;

  useEffect(() => {
    if (chatInnerRef.current) {
      chatInnerRef.current.scrollTop = chatInnerRef.current.scrollHeight;
    }
  }, [charIndex, aiCharIndex]);

  const getAiDisplayedText = () => {
    let remaining = aiCharIndex;
    return aiMessage.map((line) => {
      if (remaining <= 0) return null;
      const chars = Math.min(remaining, line.length);
      remaining -= line.length;
      return line.slice(0, chars);
    });
  };

  return (
    <div css={styles.block(isRoute)}>
      {isAyvin ? (
        isMobile ? (
          <RoutingGuideAILineMobileSvg css={styles.aiLineSvg} />
        ) : (
          <RoutingGuideAILineSvg css={styles.aiLineSvg} />
        )
      ) : isMobile ? (
        <RoutingGuideCounselorLineMobileSvg css={styles.aiLineSvg} />
      ) : (
        <RoutingGuideCounselorLineSvg css={styles.counselorLineSvg} />
      )}
      <div css={styles.itemContainer}>
        <div css={styles.badge(isAyvin)}>
          {isAyvin ? '자동 대응 가능 판단' : '자동 대응 불가 판단'}
        </div>
        <div css={styles.chatContainer}>
          <div css={styles.answerBadge(isAyvin)}>
            {isAyvin ? <HaiIcon /> : <HeadsetIcon />}
            <span>{isAyvin ? '자동 답변 AI' : '상담사 연결'}</span>
          </div>
          <div css={styles.chatting(isAyvin)}>
            <div ref={chatInnerRef} css={styles.chattingInner}>
              <div css={[styles.message, styles.customer]}>
                {isAyvin
                  ? '어제 배송왔고, 택도 안뗐는데 반품 가능할까요?'
                  : '택은 떼었는데 옷은 깨끗해요. 이 정도면 반품 가능하지 않나요?'}
              </div>
              {isAyvin &&
                isRoute &&
                (isThinking ? (
                  <div css={styles.aiAnalyzingMessage}>
                    <div css={styles.aiAnalyzingProgress}>
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>해피톡 AI가 메시지를 분석하고 있어요.</p>
                  </div>
                ) : (
                  aiCharIndex > 0 && (
                    <div css={[styles.message, styles.counselor]}>
                      {getAiDisplayedText()
                        .filter(Boolean)
                        .map((text, index, arr) => (
                          <React.Fragment key={index}>
                            {text}
                            {index < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                    </div>
                  )
                ))}
              {!isAyvin && isRoute && displayedText && (
                <div css={[styles.message, styles.counselor]}>
                  {displayedText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
