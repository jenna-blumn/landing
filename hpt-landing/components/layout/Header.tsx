'use client';

import Link from 'next/link';

import styles from './Header.style';

import HappytalkLogo from '@/assets/svg/happytalk-logo.svg';
import { usePathname } from 'next/navigation';
import HeaderWrapper from '@/components/layout/HeaderWrapper';

import NavCardHappytalk from '@/assets/svg/nav-card-happytalk.svg';
import NavCardChatbot from '@/assets/svg/nav-card-chatbot.svg';
import NavCardSolution from '@/assets/svg/nav-card-solution.svg';

import HamburgerMenu from '@/assets/svg/hamburger-menu.svg';
import MobileMenu from '@/components/layout/MobileMenu';
import { useState } from 'react';
import useHeaderTheme from '@/hooks/useHeaderTheme';
import { useEnv } from '@/contexts/EnvContext';
import { HeaderTheme } from '@/models/main';

import {
  headerNavMenus,
  productDropdownItems,
  supportDropdownLinks,
  PRODUCT_PATHS,
  SUPPORT_PATHS,
} from '@/constants/common';

const iconMap = {
  NavCardHappytalk,
  NavCardChatbot,
  NavCardSolution,
} as Record<string, React.ComponentType>;

export default function Header() {
  const pathname = usePathname();
  const { HAPPYTALK_URL, HAPPYTALK_COUNSELOR_URL } = useEnv();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [hiddenDropdown, setHiddenDropdown] = useState<string | null>(null);
  const headerTheme = useHeaderTheme();

  const isBlur = headerTheme === HeaderTheme.BLUR;

  const handleDropdownItemClick = (dropdownType: string) => {
    setHiddenDropdown(dropdownType);
  };

  const handleDropdownMouseLeave = (dropdownType: string) => {
    if (hiddenDropdown === dropdownType) {
      setHiddenDropdown(null);
    }
  };

  const onClose = () => {
    setIsOpenMenu(false);
  };

  const headerContent = (
    <>
      <MobileMenu isOpen={isOpenMenu} onClose={onClose} />
      <header css={styles.header(headerTheme)}>
        <div css={styles.container}>
          <div css={styles.logoWrapper}>
            <HamburgerMenu onClick={() => setIsOpenMenu(!isOpenMenu)} />
            <Link href="/">
              <HappytalkLogo css={styles.logo} />
            </Link>
          </div>
          <div css={styles.menu}>
            {headerNavMenus.map((menu, index) => {
              if (menu.dropdown === 'product') {
                return (
                  <div
                    key={index}
                    css={[
                      styles.menuItem(PRODUCT_PATHS.includes(pathname)),
                      styles.dropdownMenu(hiddenDropdown === 'product'),
                    ]}
                    onMouseLeave={() => handleDropdownMouseLeave('product')}
                  >
                    <Link href={menu.href}>{menu.title}</Link>
                    <div css={styles.solutionDropDown}>
                      {productDropdownItems.map((item, itemIndex) => {
                        const Icon = iconMap[item.icon];

                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            css={styles.solutionItem}
                            onClick={() => handleDropdownItemClick('product')}
                          >
                            <Icon />
                            <div css={styles.textBox}>
                              <p>{item.description}</p>
                              <p>{item.title}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (menu.dropdown === 'support') {
                return (
                  <div
                    key={index}
                    css={[
                      styles.menuItem(SUPPORT_PATHS.includes(pathname)),
                      styles.dropdownMenu(hiddenDropdown === 'support'),
                    ]}
                    onMouseLeave={() => handleDropdownMouseLeave('support')}
                  >
                    <Link href={menu.href}>{menu.title}</Link>
                    <div css={styles.supportDropDown}>
                      {supportDropdownLinks.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={
                            link.external ? 'noopener noreferrer' : undefined
                          }
                          {...(link.gtmEvent
                            ? { 'data-gtm-event': link.gtmEvent }
                            : {})}
                          onClick={() => handleDropdownItemClick('support')}
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  css={styles.menuItem(pathname === menu.href)}
                  href={menu.href || '/'}
                >
                  {menu.title}
                </Link>
              );
            })}
          </div>
          <div css={styles.buttonGroup}>
            <Link
              href={`${HAPPYTALK_URL}/auth/login`}
              data-gtm-event="HEADER_LOGIN"
            >
              로그인
            </Link>
            <a
              href={`${HAPPYTALK_COUNSELOR_URL}/auth/join`}
              data-gtm-event="HEADER_JOIN"
            >
              <span css={styles.mobileOnly}>무료시작</span>
              <span css={styles.desktopOnly}>채팅상담 무료시작</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );

  if (isBlur) return <HeaderWrapper>{headerContent}</HeaderWrapper>;
  return headerContent;
}
