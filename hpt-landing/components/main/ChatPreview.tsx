import { useEffect, useState } from 'react';

import styles from './ChatPreview.style';

import ChatItem from '@/components/main/ChatItem';

import { CHAT_MESSAGES } from '@/constants/main';
import MainInputBtn from '@/assets/svg/main-input-btn.svg';
import MainInputIcon from '@/assets/svg/main-input-icon.svg';
import MainInputMobileIcon from '@/assets/svg/main-input-icon_mobile.svg';

import { ChatMessage } from '@/models/main';

export default function ChatPreview() {
  const DEFAULT_COUNT = 4;
  const [chatArray, setChatArray] = useState<ChatMessage[]>(
    CHAT_MESSAGES.slice(0, DEFAULT_COUNT),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setChatArray((prev) => {
        if (prev.length >= CHAT_MESSAGES.length) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, CHAT_MESSAGES[prev.length]];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.chatList}>
          {chatArray.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
      <div css={styles.inputContainer}>
        <MainInputIcon css={styles.desktopIcon} />
        <MainInputMobileIcon css={styles.mobileIcon} />
        <div css={styles.input}>
          10,000+ 이상의 기업이
          <br />
          24시간 상담중
        </div>
        <div css={styles.inputBtn}>
          <MainInputBtn />
        </div>
      </div>
    </div>
  );
}
