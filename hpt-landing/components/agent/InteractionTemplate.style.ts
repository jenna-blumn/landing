import { css } from '@emotion/react';

const interactionMedia = {
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1024px)',
  wide: '@media (min-width: 1440px)',
};

export default {
  container: css`
    width: 100%;
    padding: 60px 0;

    ${interactionMedia.desktop} {
      padding: 72px 60px;
    }
  `,
};
