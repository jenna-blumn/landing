import { media } from '@/styles/breakpoints';
import { css, keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default {
  container: (isUser = true) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: ${isUser ? 'flex-end' : 'flex-start'};
    gap: 6px;
    align-self: stretch;
    animation: ${fadeIn} 0.4s ease-out forwards;
  `,

  messageBubble: css`
    display: flex;
    max-width: 240px;
    align-items: flex-end;
    position: relative;

    > svg {
      position: absolute;
      left: -5.8px;
      bottom: 0;

      &.counselor-message-tail {
        left: unset;
        right: -5.91px;
      }
    }

    ${media.desktop} {
      max-width: 300px;
    }
  `,

  messageContent: (isUser = true) => css`
    display: flex;
    width: fit-content;
    max-width: 296px;
    padding: 6px 12px;
    align-items: flex-end;
    flex-shrink: 0;
    border-radius: 20px;
    background: ${isUser ? '#11181C' : '#e3e3e3'};
    color: ${isUser ? '#fff' : '#000'};
    flex: 1 0 0;
    font-size: var(--font-size-15);
    font-style: normal;
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,
};
