import { ChatMessage } from '@/models/main';
import styles from './ChatItem.style';

import AiMessageTail from '@/assets/svg/ai-message-tail.svg';
import CounselorMessageTail from '@/assets/svg/counselor-message-tail.svg';
import { Fragment } from 'react';

interface ChatItemProps {
  chat: ChatMessage;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const { isUser, message } = chat;

  return (
    <div css={styles.container(isUser)}>
      <div css={styles.messageBubble}>
        {isUser ? (
          <CounselorMessageTail className="counselor-message-tail" />
        ) : (
          <AiMessageTail />
        )}
        <div css={styles.messageContent(isUser)}>
          {message.split('\n').map((line, index) => (
            <Fragment key={index}>
              {line}
              {index < message.split('\n').length - 1 && <br />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
