import type { Template } from '../types';
import { mockAlimtalkTemplates } from '../data/mockAlimtalkTemplates';
import { mockSmsTemplates } from '../data/mockSmsTemplates';

const DELAY_MS = 200;

const allTemplates: Template[] = [...mockAlimtalkTemplates, ...mockSmsTemplates];

/**
 * 채널 타입별 템플릿 목록 조회
 */
export async function getTemplatesByChannel(
  channelType: 'sms' | 'alimtalk'
): Promise<Template[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allTemplates.filter((t) => t.channelType === channelType));
    }, DELAY_MS);
  });
}

/**
 * 템플릿 ID로 단건 조회
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allTemplates.find((t) => t.id === id) || null);
    }, DELAY_MS);
  });
}

/**
 * 템플릿 검색 (이름 + 카테고리)
 */
export async function searchTemplates(
  channelType: 'sms' | 'alimtalk',
  query: string
): Promise<Template[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = allTemplates.filter(
        (t) =>
          t.channelType === channelType &&
          (t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(filtered);
    }, DELAY_MS);
  });
}
