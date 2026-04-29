import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 도입문의 | 우리 기업에 맞는 AI 상담 솔루션 상담';
  const description =
    'AI 에이전트, 채팅상담, 구축형 솔루션까지. 현재 상담 운영 방식에 맞는 도입 방향을 해피톡 전문가와 상담해보세요.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/contact',
    }),
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
