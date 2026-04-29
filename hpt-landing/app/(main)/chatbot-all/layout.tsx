import type { Metadata } from 'next';

import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 다해줌 | 전문가가 구축하는 맞춤형 AI 상담 솔루션';
  const description =
    '상담 시나리오 설계부터 구축과 운영 안정화까지, 해피톡 전문가가 우리 기업에 맞는 AI 상담 환경을 직접 만들어드립니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/chatbot-all',
    }),
  };
}

export default function ChatbotAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
