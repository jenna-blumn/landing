import { css } from "@emotion/react";

export default {
  container: css`
    position: absolute;
    inset: 0;
    z-index: -10;
    overflow: hidden;
  `,
  gradient: css`
    position: absolute;
    inset: 0;
    background: radial-gradient(
        980px 560px at 50% 0%,
        rgba(78, 142, 110, 0.18),
        transparent 62%
      ),
      radial-gradient(
        760px 460px at 82% 18%,
        rgba(59, 130, 246, 0.16),
        transparent 62%
      ),
      radial-gradient(
        720px 460px at 18% 22%,
        rgba(255, 213, 74, 0.14),
        transparent 62%
      ),
      linear-gradient(180deg, #ffffff 0%, #f6f8ff 48%, #ffffff 100%);
  `,
  dots: css`
    position: absolute;
    inset: 0;
    opacity: 0.22;
    background-image: radial-gradient(
      circle at 1px 1px,
      rgba(0, 0, 0, 0.055) 1px,
      transparent 0
    );
    background-size: 22px 22px;
    mask-image: radial-gradient(
      980px 560px at 50% 18%,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.3) 55%,
      rgba(0, 0, 0, 0) 82%
    );
  `,
};
