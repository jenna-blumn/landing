import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 가이드 | AI 상담 솔루션 도입과 운영 방법';
  const description =
    '도입부터 설정, 운영, 활용 팁까지 해피톡 가이드에서 확인하세요. 채팅상담, AI 에이전트, 챗봇 기능을 더 쉽게 시작할 수 있습니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/guide',
    }),
  };
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
