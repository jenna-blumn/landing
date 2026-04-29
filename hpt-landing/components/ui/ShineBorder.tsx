'use client';

import { ReactNode } from 'react';
import { css, keyframes, SerializedStyles } from '@emotion/react';

interface ShineBorderProps {
  children?: ReactNode;
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
  borderRadius?: number;
  background?: string;
  className?: string;
  customCss?: SerializedStyles;
}

const rotateAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const styles = {
  container: (borderRadius: number) => css`
    position: relative;
    border-radius: ${borderRadius}px;
  `,
  borderWrapper: (borderRadius: number) => css`
    position: absolute;
    inset: 0;
    border-radius: ${borderRadius}px;
    overflow: hidden;
    container-type: size;
  `,
  shineBorder: (duration: number, shineColor: string | string[]) => {
    const colors = Array.isArray(shineColor) ? shineColor : [shineColor];
    const repeatedColors = [...colors, ...colors, ...colors, ...colors];
    const colorStops = repeatedColors
      .map((color, i) => {
        const position = (i / repeatedColors.length) * 100;
        return `${color} ${position}%`;
      })
      .join(', ');

    return css`
      position: absolute;
      top: 50%;
      left: 50%;
      pointer-events: none;
      width: 142cqmax;
      aspect-ratio: 1;
      background: conic-gradient(
        from 0deg,
        ${colorStops},
        ${repeatedColors[0]} 100%
      );
      animation: ${rotateAnimation} ${duration}s linear infinite;
      will-change: transform;
      backface-visibility: hidden;
    `;
  },
  content: (
    borderRadius: number,
    borderWidth: number,
    background: string,
  ) => css`
    position: relative;
    z-index: 1;
    margin: ${borderWidth}px;
    border-radius: ${borderRadius - borderWidth}px;
    background: ${background};
    overflow: hidden;
  `,
};

export default function ShineBorder({
  children,
  borderWidth = 2,
  duration = 4,
  shineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
  borderRadius = 8,
  background = '#fff',
  className,
  customCss,
}: ShineBorderProps) {
  return (
    <div
      css={[styles.container(borderRadius), customCss]}
      className={className}
    >
      <div css={styles.borderWrapper(borderRadius)}>
        <div css={styles.shineBorder(duration, shineColor)} />
      </div>
      <div css={styles.content(borderRadius, borderWidth, background)}>
        {children}
      </div>
    </div>
  );
}
