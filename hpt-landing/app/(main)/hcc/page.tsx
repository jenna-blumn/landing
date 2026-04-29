import type { Metadata } from 'next';

import HCCTemplate from '@/components/hcc/HCCTemplate';
import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 구축형 솔루션 | 엔터프라이즈 맞춤형 AI 상담 구축';
  const description =
    '보안, 확장성, 커스터마이징이 중요한 기업을 위한 구축형 AI 상담 솔루션. 우리 환경에 맞는 구조 설계와 안정적인 상담 인프라를 제공합니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/hcc',
    }),
  };
}

export default function HCCPage() {
  return <HCCTemplate />;
}
