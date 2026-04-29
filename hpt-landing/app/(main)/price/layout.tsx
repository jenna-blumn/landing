import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 플랜안내 | AI 상담·채팅상담 요금제';
  const description =
    '무료 체험부터 엔터프라이즈까지, 상담 규모와 운영 방식에 맞는 해피톡 요금제를 확인하세요. 채팅상담, AI 에이전트, 고도화 기능을 플랜별로 비교할 수 있습니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/price',
    }),
  };
}

export default function PriceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
