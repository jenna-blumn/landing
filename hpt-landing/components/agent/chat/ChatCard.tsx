'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import styles from './ChatCard.style';

import Bubble from '@/components/agent/chat/Bubble';
import GradientBorder from '@/components/agent/chat/GradientBorder';
import AiAnalyzingProgress from '@/components/agent/chat/AiAnalyzingProgress';

import useSending from '@/hooks/useSending';

import { useChatStore } from '@/stores/chatStore';

import { useSocketContext } from '@/contexts/SocketContext';

import { QUICK_QUESTIONS } from '@/constants/chatting';

import { ChatMode } from '@/models/chat';
import { closeChatRoom$ } from '@/api/chat';
import { useAuthStore } from '@/stores/authStore';
import usePrevChatRoom from '@/hooks/usePrevChatRoom';
import Link from 'next/link';
import SendIcon from '@/assets/svg/send-icon_s16.svg';
import SendFillIcon from '@/assets/svg/send-fill-icon_s18.svg';
import AyvinIcon from '@/assets/svg/ayvin-icon_s32.svg';
import RestartIcon from '@/assets/svg/restart-icon_s16.svg';
interface ChatCardProps {
  isEmbedChat?: boolean;
}

export default function ChatCard({ isEmbedChat = false }: ChatCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { siteId } = useAuthStore();
  const {
    customer: { id: customerId },
    isConnectedSocket,
    chatData,
    isLoadedChatData,
    isAIReady,
    pendingMessage,
    setPendingMessage,
    room,
    aiRequests,
  } = useChatStore();

  const { getIngRoom } = usePrevChatRoom();
  const { openChatRoom } = useSocketContext();

  const {
    onChangeMode,
    mode,
    message,
    onChangeMessage,
    onReset,
    onSendMessage,
  } = useSending();

  const isChat = mode === 'chat';
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (
      !isEmbedChat &&
      chatData.filter((item) => item.user_type === 'C').length >= 5
    ) {
      setIsExpired(true);
    }
  }, [chatData, isEmbedChat]);

  const onClickReset = async () => {
    if (!customerId || !room.chatListId) return;
    setIsExpired(false);

    try {
      await closeChatRoom$({
        siteId,
        customerId,
        chatListId: room.chatListId,
      });

      onReset();
    } catch (error) {
      console.log(error);
    }
  };

  const startChatWithText = (text: string) => {
    const question = text.trim();
    if (!question) return;

    if (mode !== ChatMode.CHAT) onChangeMode(ChatMode.CHAT);
    onChangeMessage('');

    if (isLoadedChatData) {
      onSendMessage(question);
    } else {
      setPendingMessage(question);
      openChatRoom();
    }
  };

  const handleHeroKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startChatWithText(message);
    }
  };

  const handleSendInChat = (text: string) => {
    const question = text.trim();
    if (!question) return;

    onChangeMessage('');
    onSendMessage(question);
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendInChat(message);
    }
  };

  useEffect(() => {
    if (isLoadedChatData && isAIReady && pendingMessage && room.chatListId) {
      onSendMessage(pendingMessage);
      setPendingMessage(null);
    }
  }, [
    isLoadedChatData,
    isAIReady,
    pendingMessage,
    room.chatListId,
    setPendingMessage,
  ]);

  useEffect(() => {
    const ingRoom = getIngRoom();

    if (ingRoom && isConnectedSocket) {
      openChatRoom();
      onChangeMode(ChatMode.CHAT);
    }
  }, [isConnectedSocket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatData.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || Object.keys(aiRequests).length === 0) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [aiRequests]);

  return (
    <div css={styles.cardWrapper(!!isEmbedChat)}>
      <motion.div
        layout
        transition={{ duration: 0.24, ease: 'easeOut' }}
        css={styles.cardContainer(isChat)}
      >
        <AnimatePresence mode="wait">
          {mode === ChatMode.HERO ? (
            <motion.div
              key="hero"
              layoutId="morph-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <GradientBorder>
                <div css={styles.heroInner}>
                  <div css={styles.heroCard}>
                    <textarea
                      value={message}
                      onChange={(e) => onChangeMessage(e.target.value)}
                      onKeyDown={handleHeroKeyDown}
                      placeholder="질문을 입력하거나, 아래 질문 목록을 선택하면 해피톡 AI가 즉시 응답합니다."
                      css={styles.heroTextarea}
                    />
                    <div css={styles.heroFooter}>
                      <div css={styles.heroHint}>
                        Enter 로 전송 / Shift+Enter로 줄바꿈
                      </div>
                      <button
                        css={styles.sendButton}
                        onClick={() => startChatWithText(message)}
                        disabled={!message.trim()}
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </GradientBorder>
              <p css={styles.description}>
                체험 시나리오는 이커머스 기준이며, 도입 시 업종에 맞게 사용할 수
                있습니다.
              </p>
              <div css={styles.quickWrapper}>
                <motion.div
                  layout
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  css={styles.quickContainer}
                >
                  <div css={styles.quickButtons}>
                    {QUICK_QUESTIONS.map((question) => (
                      <button
                        key={question.id}
                        css={styles.quickButton}
                        onClick={() => startChatWithText(question.label)}
                        data-gtm-event={question.gtmEvent}
                      >
                        {question.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              layoutId="morph-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onAnimationComplete={() => {
                inputRef.current?.focus();
                const el = scrollRef.current;
                if (el) {
                  el.scrollTo({
                    top: el.scrollHeight,
                    behavior: 'smooth',
                  });
                }
              }}
            >
              <GradientBorder>
                <div css={styles.chatContainer(!!isEmbedChat)}>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      ease: 'easeOut',
                      delay: 0.15,
                    }}
                  >
                    <div css={styles.chatHeader}>
                      <div css={styles.chatHeaderLeft}>
                        <div css={styles.chatAvatar}>
                          <AyvinIcon />
                        </div>
                        <span>AI 에이전트</span>
                      </div>
                      <button
                        css={styles.resetButton}
                        onClick={onClickReset}
                        data-gtm-event="AGENT_CHAT_RESTART"
                      >
                        <RestartIcon />
                        <span>다시 시작</span>
                      </button>
                    </div>
                  </motion.div>

                  <div ref={scrollRef} css={styles.chatMessages}>
                    <div css={styles.messageList}>
                      {chatData.map((item, idx) => (
                        <Bubble key={idx} item={item} />
                      ))}
                      {Object.keys(aiRequests).length > 0 && (
                        <AiAnalyzingProgress aiRequests={aiRequests} />
                      )}
                    </div>
                  </div>

                  <div css={styles.chatInputWrapper}>
                    <input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => {
                        if (isExpired) return;
                        onChangeMessage(e.target.value);
                      }}
                      onKeyDown={handleChatKeyDown}
                      css={styles.chatInput}
                      placeholder="해피톡 AI에게 메시지를 입력해 주세요."
                      disabled={isExpired}
                    />
                    <button
                      css={styles.chatSendButton}
                      onClick={() => handleSendInChat(message)}
                      disabled={!message.trim() || isExpired}
                    >
                      <SendFillIcon />
                    </button>
                  </div>

                  {isExpired && (
                    <div css={styles.expireOverlay}>
                      <div css={styles.expireModal}>
                        <p css={styles.expireTitle}>
                          해피톡 AI 체험이 완료되었어요.
                        </p>
                        <p css={styles.expireDescription}>
                          방금 체험하신 해피톡 AI는 실제 운영 환경에 맞게
                          조정하고 확장할 수 있습니다.
                          <br />
                          우리 기업에 맞는 AI 에이전트를 구성해보세요.
                        </p>
                        <div css={styles.expireButtons}>
                          <Link
                            href="/contact"
                            css={styles.expirePrimaryButton}
                            data-gtm-event="AGENT_FINISH_SALES_INQUIRY"
                          >
                            도입 문의하기
                          </Link>
                          <button
                            css={styles.expireSecondaryButton}
                            onClick={onClickReset}
                            data-gtm-event="AGENT_FINISH_CHAT_RESTART"
                          >
                            다시 체험하기
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GradientBorder>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
