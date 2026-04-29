import { css, keyframes } from '@emotion/react';

const dotPulse1 = keyframes`
  0%, 33% { background-color: #a1a1aa; }
  34%, 100% { background-color: #e4e4e7; }
`;

const dotPulse2 = keyframes`
  0%, 33% { background-color: #e4e4e7; }
  34%, 66% { background-color: #a1a1aa; }
  67%, 100% { background-color: #e4e4e7; }
`;

const dotPulse3 = keyframes`
  0%, 66% { background-color: #e4e4e7; }
  67%, 100% { background-color: #a1a1aa; }
`;

export default {
  aiAnalyzingMessage: css`
    display: flex;
    align-items: center;
    gap: 8px;

    > svg {
      flex-shrink: 0;
    }

    p {
      color: #333;
      opacity: 0.6;
      font-size: var(--font-size-13);
      font-style: normal;
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      text-align: left;
    }
  `,
  aiAnalyzingProgress: css`
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;

      &:nth-of-type(1) {
        background-color: #a1a1aa;
        animation: ${dotPulse1} 1.2s steps(1) infinite;
      }
      &:nth-of-type(2) {
        background-color: #e4e4e7;
        animation: ${dotPulse2} 1.2s steps(1) infinite;
      }
      &:nth-of-type(3) {
        background-color: #e4e4e7;
        animation: ${dotPulse3} 1.2s steps(1) infinite;
      }
    }
  `,
};
