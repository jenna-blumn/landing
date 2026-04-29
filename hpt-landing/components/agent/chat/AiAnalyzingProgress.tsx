import { useMemo } from 'react';

import AyvinIcon from '@/assets/svg/ayvin-icon_s32.svg';

import styles from './AiAnalyzingProgress.style';

interface Props {
  aiRequests: Record<string, string>;
}

export default function AiAnalyzingProgress({ aiRequests }: Props) {
  const aiAnalyzingMessage = useMemo(() => {
    const messageTypes = Object.values(aiRequests);

    if (messageTypes.every((type) => type === 'request')) {
      return '해피톡 AI가 메시지를 분석하고 있어요.';
    }

    return '해피톡 AI가 분석한 내용을 바탕으로 답변을 준비 중이에요.';
  }, [aiRequests]);

  return (
    <div css={styles.aiAnalyzingMessage}>
      <AyvinIcon />
      <div css={styles.aiAnalyzingProgress}>
        <span />
        <span />
        <span />
      </div>
      <p>{aiAnalyzingMessage}</p>
    </div>
  );
}
