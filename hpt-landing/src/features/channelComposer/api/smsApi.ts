import type { SmsSenderNumber } from '../types';
import { mockSenderNumbers } from '../data/mockSmsConfig';

const DELAY_MS = 150;

/**
 * SMS 발신번호 목록 조회
 */
export async function getSenderNumbers(): Promise<SmsSenderNumber[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockSenderNumbers]);
    }, DELAY_MS);
  });
}

/**
 * 브랜드에 연결된 기본 발신번호 조회
 */
export async function getDefaultSenderForBrand(
  brandId: string
): Promise<SmsSenderNumber | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const brandSender = mockSenderNumbers.find((s) => s.brandId === brandId);
      const defaultSender = mockSenderNumbers.find((s) => s.isDefault);
      resolve(brandSender || defaultSender || null);
    }, DELAY_MS);
  });
}
