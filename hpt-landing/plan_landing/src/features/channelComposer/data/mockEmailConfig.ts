import type { EmailSignature } from '../types';

export const mockEmailSignatures: EmailSignature[] = [
  {
    id: 'sig_1',
    name: '기본 서명',
    content:
      '\n\n---\n감사합니다.\n데스크잇 고객센터\nTel: 1588-1818\nEmail: support@deskit.com\nwww.deskit.com',
    isDefault: true,
  },
  {
    id: 'sig_2',
    name: '간단 서명',
    content: '\n\n감사합니다.\n고객센터 드림',
    isDefault: false,
  },
  {
    id: 'sig_3',
    name: '공식 서명 (영문)',
    content:
      '\n\n---\nBest regards,\nDeskit Customer Support\nTel: +82-2-1588-1818\nEmail: support@deskit.com',
    isDefault: false,
  },
];
