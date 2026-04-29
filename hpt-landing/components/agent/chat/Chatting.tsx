'use client';

import styles from './Chatting.style';

import ChatCard from '@/components/agent/chat/ChatCard';

export default function Chatting() {
  return (
    <div css={styles.container} data-header-theme="blur">
      <main css={styles.main}>
        <div css={styles.content}>
          <h1 css={styles.title}>
            신뢰할 수 있는 업무 파트너
            <br />
            해피톡 AI 에이전트
          </h1>

          <p css={styles.subtitle}>
            운영 정책에 따라 일관되게 응대하는 AI 상담사
          </p>

          <ChatCard />
        </div>
      </main>
    </div>
  );
}
