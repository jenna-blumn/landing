import { css, keyframes } from '@emotion/react';

const bounceDown = keyframes`
  0% { transform: translateY(-5px); opacity: 0; }
  50% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(6px); opacity: 0; }
`;

export default {
  container: css`
    display: flex;
    justify-content: center;
    z-index: 20;
    margin-top: -20px;
    margin-bottom: -20px;
    pointer-events: none;
    flex-shrink: 0;

    > * {
      pointer-events: auto;
    }
  `,

  button: (isAtBottom: boolean) => css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #c0c9d6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    ${isAtBottom && 'transform: rotate(180deg);'}

    &:hover {
      border-color: #306afe;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      > svg {
        color: #306afe;
      }
    }
  `,

  icon: css`
    color: #c0c9d6;
    width: 12px;
    height: 12px;
    animation: ${bounceDown} 1.5s ease infinite;
    transition: color 0.3s ease;
  `,
};
