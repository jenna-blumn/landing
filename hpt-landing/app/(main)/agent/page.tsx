import type { Metadata } from 'next';

import AgentTemplate from '@/components/AgentTemplate';
import { createOpenGraph } from '@/lib/metadata';

const isProduction = process.env.PROFILE === 'production';

export function generateMetadata(): Metadata {
  const title = '해피톡 AI 에이전트 | 신뢰할 수 있는 AI 상담사';
  const description =
    '운영 정책, 검증된 지식, 연결된 도구를 기반으로 고객 문의를 정확하게 이해하고 처리하는 AI 에이전트. 상담 자동화는 물론 실제 업무 처리가 가능한 도구들의 자연스러운 협업까지 지원합니다.';

  if (!isProduction) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/agent',
    }),
  };
}

export default function AgentPage() {
  return <AgentTemplate />;
}
