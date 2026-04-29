import styles from './ScrollDownButton.style';

import ChevronDown from '@/assets/svg/chevron-down.svg';

interface Props {
  isAtBottom: boolean;
  onClick: () => void;
}

export default function ScrollDownButton({ isAtBottom, onClick }: Props) {
  return (
    <div css={styles.container}>
      <button
        type="button"
        css={styles.button(isAtBottom)}
        aria-label={isAtBottom ? '맨 위로 이동' : '아래로 스크롤'}
        onClick={onClick}
      >
        <ChevronDown css={styles.icon} />
      </button>
    </div>
  );
}
