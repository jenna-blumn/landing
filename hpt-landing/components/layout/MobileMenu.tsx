'use client';

import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import styles from './MobileMenu.style';

import HappytalkLogo from '@/assets/svg/happytalk-logo.svg';
import CloseBtn from '@/assets/svg/close-btn_s24.svg';

import { mobileNavMenus } from '@/constants/common';
import { useLayoutStore } from '@/stores/layoutStore';
import { useEnv } from '@/contexts/EnvContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { HAPPYTALK_COUNSELOR_URL } = useEnv();
  const isDesktop = useLayoutStore((state) => state.isDesktop);

  useEffect(() => {
    if (isDesktop === null) return;
    document.body.style.overflow = isOpen && !isDesktop ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isDesktop]);

  return (
    <div css={styles.overlay(isOpen)}>
      <div css={styles.header}>
        <div css={styles.logoWrapper}>
          <button css={styles.closeButton} onClick={onClose}>
            <CloseBtn />
          </button>
          <Link href="/" onClick={onClose}>
            <HappytalkLogo />
          </Link>
        </div>
        <div css={styles.buttonWrapper}>
          <Link
            href="/auth/join"
            data-gtm-event="HEADER_LOGIN"
            onClick={onClose}
          >
            로그인
          </Link>
          <a
            href={`${HAPPYTALK_COUNSELOR_URL}/auth/join`}
            data-gtm-event="HEADER_JOIN"
          >
            무료시작
          </a>
        </div>
      </div>
      <div css={styles.navMenuContainer}>
        {mobileNavMenus.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {groupIndex > 0 && <div css={styles.divider} />}
            <div css={styles.navMenuGroup}>
              {group.title && (
                <p css={styles.navMenuGroupTitle}>{group.title}</p>
              )}
              {group.links.map((link, linkIndex) =>
                link.href.startsWith('http') ? (
                  <a
                    key={linkIndex}
                    css={styles.navMenuItem}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-gtm-event="HEADER_DEV_CENTER"
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    key={linkIndex}
                    css={styles.navMenuItem}
                    href={link.href}
                    onClick={onClose}
                  >
                    {link.title}
                  </Link>
                ),
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
