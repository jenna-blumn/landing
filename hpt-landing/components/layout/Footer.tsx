'use client';

import Link from 'next/link';
import styles from './Footer.style';

import { footerLinks } from '@/constants/common';
import { useState } from 'react';

import Logo from '@/assets/images/happytalk-logo.png';
import CertISMS from '@/assets/images/cert-isms.png';
import CertISO from '@/assets/images/cert-iso.png';
import ArrowRightIcon from '@/assets/svg/arrow-right_s18.svg';
import Modal from '@/components/common/Modal';
import IsmsCertification from '@/components/common/IsmsCertification';

const isInternal = (href: string) => href.startsWith('/');

export default function Footer() {
  const [isIsmsOpen, setIsIsmsOpen] = useState(false);

  const onOpenIsms = () => {
    setIsIsmsOpen(true);
  };

  const onCloseIsms = () => {
    setIsIsmsOpen(false);
  };

  return (
    <footer css={styles.footer}>
      <div css={[styles.container, styles.topContainer]}>
        <div css={styles.leftCol}>
          <div css={styles.logoWrapper}>
            <img src={Logo.src} alt="Happytalk Logo" />
          </div>
          <div css={styles.leftBody}>
            <div css={[styles.block, styles.callCenter]}>
              <p>
                <span>24시간 고객센터</span>
                <span css={styles.divide} />
                <span>help@blumn.ai</span>
              </p>
              <p>1666-5263</p>
            </div>
            <Link
              href="/contact"
              css={styles.downloadButton}
              data-gtm-event="FOOTER_SALES_INQUIRY"
            >
              <span>도입 문의하기</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <div css={styles.rightCol}>
          <div css={styles.rightColInner}>
            {footerLinks.map((section) => {
              const renderLink = (link: (typeof section.links)[number]) =>
                isInternal(link.href) ? (
                  <Link
                    key={link.title}
                    href={link.href}
                    data-gtm-event={link.gtmEvent || undefined}
                  >
                    {link.title}
                  </Link>
                ) : (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-gtm-event={link.gtmEvent || undefined}
                  >
                    {link.title}
                  </a>
                );

              return (
                <div key={section.title} css={styles.list}>
                  <p>{section.title}</p>
                  {section.twoColumn ? (
                    <>
                      <div css={styles.twoColumn}>
                        <div>{section.links.slice(0, 3).map(renderLink)}</div>
                        <div>{section.links.slice(3).map(renderLink)}</div>
                      </div>
                      <div css={styles.mobileTwoColumn}>
                        {section.links.map(renderLink)}
                      </div>
                    </>
                  ) : (
                    <div>{section.links.map(renderLink)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div css={[styles.container, styles.bottomContainer]}>
        <div css={styles.address}>
          <p className="bold">(주)블룸에이아이</p>
          <div>
            <p>서울 중구 서소문로 89, 순화빌딩 6층, 대표이사: 김범수, 박진영</p>
            <p>
              사업자등록번호: 773-87-00356 통신판매업 신고번호: 제
              2024-서울중구-1646호
            </p>
          </div>
        </div>
        <div css={styles.linksContainer}>
          <p>© Blumn AI Corp. All rights Reserved.</p>
          <img
            css={styles.ismsImage}
            src={CertISMS.src}
            onClick={onOpenIsms}
            alt="ISMS 인증"
          />
          <img src={CertISO.src} alt="ISO 인증" />
        </div>
      </div>
      {isIsmsOpen && (
        <Modal onClose={onCloseIsms}>
          <IsmsCertification />
        </Modal>
      )}
    </footer>
  );
}
