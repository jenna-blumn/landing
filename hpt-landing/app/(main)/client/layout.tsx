import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 고객사례 | AI 상담과 채팅상담 도입 사례';
  const description =
    '해피톡을 도입한 기업들의 실제 운영 변화와 성과를 확인해보세요. 채팅상담, 챗봇, AI 상담으로 달라진 고객경험과 상담 효율을 소개합니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/client',
    }),
  };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
