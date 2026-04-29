import { media } from '@/styles/breakpoints';
import { css } from '@emotion/react';

export default {
  cardWrapper: (isEmbedChat: boolean) => css`
    width: 100%;
    display: flex;
    justify-content: center;

    ${isEmbedChat &&
    css`
      padding-top: 20px;
    `}
  `,
  cardContainer: (isChat: boolean) => css`
    width: 100%;
    max-width: ${isChat ? '430px' : '600px'};
    transition: max-width 0.24s ease-out;
  `,

  // Hero mode styles
  heroInner: css`
    padding: 16px;
  `,
  heroCard: css`
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    overflow: hidden;
    padding: 12px;
  `,

  description: css`
    text-align: left;
    color: rgba(39, 39, 42, 0.3);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    margin: 12px 0;
  `,

  heroTextarea: css`
    min-height: 60px;
    width: 100%;
    resize: none;
    background-color: #fff;
    outline: none;
    border: none;
    overflow-y: auto;
    color: #6f6f77;
    text-overflow: ellipsis;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 4px;
  `,
  heroFooter: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  heroHint: css`
    overflow: hidden;
    color: rgba(39, 39, 42, 0.3);
    text-overflow: ellipsis;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,
  sendButton: css`
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    padding: 10px;
    background-color: #d4d4d8;
    border: none;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  // Chat mode styles
  chatContainer: (isEmbedChat: boolean) => css`
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    height: 645px;
    max-height: ${isEmbedChat ? 'calc(100vh - 22px)' : '65vh'};
  `,
  chatHeader: css`
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e4e4e7;
  `,
  chatHeaderLeft: css`
    display: flex;
    align-items: center;
    gap: 13px;

    span {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
    }
  `,
  chatAvatar: css`
    height: 36px;
    width: 36px;
    display: grid;
    place-items: center;
  `,

  chatHeaderTitle: css`
    color: rgba(17, 17, 21, 0.9);
    text-align: left;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
  `,
  chatHeaderSub: css`
    font-size: var(--font-size-13);
    color: rgba(0, 0, 0, 0.5);
  `,
  resetButton: css`
    display: flex;
    gap: 4px;
    padding: 6px 10px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background-color: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);

    > span {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,
  chatMessages: css`
    flex: 1;
    overflow: auto;
    padding: 16px;
  `,
  messageList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  chatInputWrapper: css`
    padding: 16px;
    border-top: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  chatInput: css`
    flex: 1;
    border-radius: 8px;
    padding: 8px;
    color: #6f6f77;
    background-color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    border: 1px solid rgba(0, 0, 0, 0.15);
    outline: none;

    &:focus {
      border-color: rgba(0, 0, 0, 0.3);
    }

    &:disabled {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,
  chatSendButton: css`
    border-radius: 6px;
    background-color: #437dfc;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    width: 38px;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
    aspect-ratio: 1 / 1;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  // Expire overlay
  expireOverlay: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(39, 39, 42, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `,
  expireModal: css`
    width: 352px;
    max-width: calc(100% - 48px);
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    box-shadow:
      0 0 0 1px rgba(39, 39, 42, 0.1),
      0 1px 1px -0.5px rgba(0, 0, 0, 0.04),
      0 3px 3px 0 rgba(0, 0, 0, 0.04),
      0 6px 6px 0 rgba(0, 0, 0, 0.04),
      0 12px 12px 0 rgba(0, 0, 0, 0.04);
  `,
  expireTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;
  `,
  expireDescription: css`
    color: #4e4e55;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;
  `,
  expireButtons: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding-top: 12px;
  `,
  expirePrimaryButton: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    border: none;
    background: #437dfc;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `,
  expireSecondaryButton: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `,

  // Quick questions
  quickWrapper: css`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
  quickContainer: css`
    width: 100%;
    max-width: 600px;
    transition: max-width 0.24s ease-out;
  `,
  quickButtons: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  `,
  quickButton: css`
    display: flex;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 6px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    white-space: nowrap;
    cursor: pointer;

    ${media.desktop} {
      line-height: var(--line-height-normal);
    }
  `,
};
