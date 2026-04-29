import { css } from '@emotion/react';

export default {
  container: (isUser: boolean) => css`
    display: flex;
    justify-content: ${isUser ? 'flex-end' : 'flex-start'};
  `,
  bubble: (isUser: boolean) => css`
    max-width: 300px;
    border-radius: 12px;
    padding: 8px 10px;
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-tight);

    word-break: break-words;
    white-space: pre-wrap;
    background-color: ${isUser ? '#222225' : '#fff'};
    color: ${isUser ? '#fff' : 'rgba(17, 17, 21, 0.9)'};
    text-align: left;
    word-break: break-all;

    ${!isUser &&
    css`
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow:
        0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
        0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `}
  `,
};
