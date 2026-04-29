import styles from './CardWrapper.style';

interface Props {
  title: string;
  children: React.ReactNode;
  left?: number;
  right?: number;
  top: number;
  zIndex: number;
  width?: number;
  height?: number;
}

export default function CardWrapper({
  title,
  children,
  left,
  right,
  top,
  zIndex,
  width,
  height,
}: Props) {
  return (
    <div css={styles.container(top, zIndex, left, right)}>
      <div css={styles.wrapper(width, height)}>
        <div css={styles.title}>{title}</div>
        {children}
      </div>
    </div>
  );
}
