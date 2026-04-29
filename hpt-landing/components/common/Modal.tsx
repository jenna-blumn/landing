'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.style';

import CloseBtn from '@/assets/svg/close-btn_s24.svg';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  hideCloseButton?: boolean;
  isDesktopOnly?: boolean;
}

export default function Modal({
  children,
  onClose,
  hideCloseButton = false,
  isDesktopOnly = false,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  return createPortal(
    <div css={styles.overlay(isDesktopOnly)} onClick={onClose}>
      <div css={styles.content} onClick={(e) => e.stopPropagation()}>
        {!hideCloseButton && (
          <button css={styles.closeButton} onClick={onClose}>
            <CloseBtn />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
