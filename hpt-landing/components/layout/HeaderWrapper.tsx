import { useEffect, useState } from 'react';
import styles from './HeaderWrapper.style';

const blurLayers = [
  { blur: 0, opacity: 1 },
  { blur: 2, opacity: 0.975 },
  { blur: 4, opacity: 0.95 },
  { blur: 6, opacity: 0.925 },
  { blur: 8, opacity: 0.9 },
];

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBlurVisible, setIsBlurVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const blurIntensity = Math.min(window.scrollY / 100, 1);

      setIsBlurVisible(blurIntensity > 0.5);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div css={styles.container}>
      <div css={styles.blurContainer}>
        {blurLayers.map((layer, i) => (
          <div
            key={i}
            css={styles.blurLayer(layer.blur, layer.opacity, i, isBlurVisible)}
          />
        ))}
        <div css={styles.gradientOverlay} />
      </div>
      {children}
    </div>
  );
}
