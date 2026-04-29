'use client';

import { useCallback, useMemo } from 'react';

import styles from './Bubble.style';

import { ChatData } from '@/models/chat';

interface BubbleProps {
  item: ChatData;
}

export default function Bubble({ item }: BubbleProps) {
  const isEndUser = item.user_type === 'C';

  const renderChatting = useCallback((text: string) => {
    return text
      .replace(/&gt;/gi, '>')
      .replace(/&lt;/gi, '<')
      .replace(/&amp;/gi, '&');
  }, []);

  const msg = useMemo(() => {
    const message = item.contents || item.msg || '';

    switch (item.contents_type) {
      case 'awesomebot': {
        const parsedMessage = JSON.parse(message);

        if (Array.isArray(parsedMessage.data)) {
          return renderChatting(parsedMessage.data[0].message);
        }

        return renderChatting(parsedMessage.data);
      }
      default:
        return renderChatting(message);
    }
  }, [item, renderChatting]);

  return (
    <div css={styles.container(isEndUser)}>
      <div css={styles.bubble(isEndUser)}>{msg}</div>
    </div>
  );
}
