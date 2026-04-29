import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 채팅상담 | 기업의 신뢰를 지키는 AI 상담 솔루션';
  const description =
    '여러 상담 채널을 하나로 통합하고, 챗봇과 상담사가 유기적으로 협업하는 채팅상담 솔루션. 상담 자동화와 운영 효율을 함께 높여 더 나은 고객경험을 만드세요.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/chat',
    }),
  };
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
