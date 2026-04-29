import type { Metadata } from 'next';
import Script from 'next/script';
import { Agentation } from 'agentation';

import './globals.css';

import { EmotionRegistry } from '@/lib/emotion';
import { createOpenGraph } from '@/lib/metadata';
import LayoutInit from '@/components/LayoutInit';
import { EnvProvider, type EnvValues } from '@/contexts/EnvContext';

export const dynamic = 'force-dynamic';

const isProduction = process.env.PROFILE === 'production';
const shouldShowAgentation =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_AGENTATION_ENABLED === 'true';

function getEnv(): EnvValues {
  return {
    WEBHOOK_API_URL:
      process.env.WEBHOOK_API_URL || 'https://patch-webhook.happytalkio.com',
    SOCKET_URL: process.env.SOCKET_URL || 'wss://patch-chat.happytalk.io',
    HAPPYTALK_COUNSELOR_URL:
      process.env.HAPPYTALK_COUNSELOR_URL ||
      'https://patch-counselor.happytalk.io/',
    HAPPYTALK_URL: process.env.HAPPYTALK_URL || 'https://patch.happytalk.io',
    WEB_CHAT_URL:
      process.env.WEB_CHAT_URL || 'https://patch-design.happytalkio.com',
  };
}

export function generateMetadata(): Metadata {
  const title = '해피톡 | AI 에이전트와 채팅상담을 연결하는 AI 상담 솔루션';
  const description =
    'AI 에이전트, 채팅상담, 챗봇, 전화상담을 하나로 연결하는 통합 AICC 솔루션. 반복 문의 자동화부터 실제 상담 업무까지, 해피톡으로 더 정확하고 효율적인 고객경험을 만드세요.';

  if (!isProduction) {
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: createOpenGraph({
        title,
        description,
        url: 'https://patch-landing.happytalk.io/',
      }),
      icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
      },
    };
  }

  return {
    title,
    description,
    openGraph: createOpenGraph({
      title,
      description,
      url: 'https://www.happytalk.io/',
    }),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: 'QgTLMFlCWnNTiQ418o71icPIoqGNDlqbBd4wD8hXIHU',
      other: {
        'naver-site-verification': 'a462d4306010bfdb5a12cf4e02bcf2c81f39a58c',
      },
    },
    alternates: {
      canonical: 'https://www.happytalk.io/',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PROFILE__=${JSON.stringify(process.env.PROFILE || 'patch')}`,
          }}
        />
        {isProduction && (
          <Script
            id="gtm-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KKBZP7D');`,
            }}
          />
        )}
        {isProduction && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: '해피톡',
                alternateName: 'Happytalk',
                url: 'https://www.happytalk.io/',
              }),
            }}
          />
        )}
      </head>
      <body>
        {isProduction && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KKBZP7D"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        )}
        <LayoutInit />
        <EnvProvider env={getEnv()}>
          <EmotionRegistry>{children}</EmotionRegistry>
        </EnvProvider>
        {shouldShowAgentation && <Agentation />}
      </body>
    </html>
  );
}
