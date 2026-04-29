import { useState } from 'react';
import styles from './ClientLogoGridSection.style';
import {
  CLIENT_LOGOS,
  CLIENT_PAGE_COUNT,
  CLIENT_PAGE_SIZE,
} from '@/constants/client';

export default function ClientLogoGridSection() {
  const [activePage, setActivePage] = useState(1);

  const startIndex = (activePage - 1) * CLIENT_PAGE_SIZE;
  const pagedLogos = CLIENT_LOGOS.slice(
    startIndex,
    startIndex + CLIENT_PAGE_SIZE,
  );

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h2 css={styles.title}>해피톡과 함께하는 고객사를 소개합니다</h2>
        <div css={styles.grid}>
          {pagedLogos.map((logo) => (
            <div
              key={logo.name}
              css={styles.logoCard}
              style={{
                backgroundImage: `url(${logo.image})`,
              }}
            >
              <div css={styles.logoCardOverlay}>{logo.description}</div>
            </div>
          ))}
        </div>

        <div css={styles.bottomArea}>
          <div css={styles.pagination}>
            <div
              css={styles.pageButton(activePage === 1)}
              onClick={() => activePage > 1 && setActivePage(activePage - 1)}
            >
              <svg
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 2.5L3.5 7L8.5 11.5"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            {Array.from({ length: CLIENT_PAGE_COUNT }, (_, i) => i + 1).map(
              (page) => (
                <span
                  key={page}
                  css={styles.pageNumber(activePage === page)}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </span>
              ),
            )}
            <div
              css={styles.pageButton(activePage === CLIENT_PAGE_COUNT)}
              onClick={() =>
                activePage < CLIENT_PAGE_COUNT &&
                setActivePage(activePage + 1)
              }
            >
              <svg
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 2.5L9.5 7L4.5 11.5"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
