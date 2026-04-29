import type { EmailSignature } from '../types';
import { mockEmailSignatures } from '../data/mockEmailConfig';

const DELAY_MS = 150;

/**
 * 이메일 서명 목록 조회
 */
export async function getSignatures(): Promise<EmailSignature[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEmailSignatures]);
    }, DELAY_MS);
  });
}

/**
 * 기본 서명 조회
 */
export async function getDefaultSignature(): Promise<EmailSignature | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmailSignatures.find((s) => s.isDefault) || null);
    }, DELAY_MS);
  });
}
