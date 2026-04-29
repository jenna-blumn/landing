'use client';

import Script from 'next/script';

import RecatchTemplate from '@/components/RecatchTemplate';

export default function ContactPage() {
  return (
    <>
      <Script
        id="recatch-embed-script"
        src="https://cdn.recatch.cc/recatch-embed.iife.js?t=mbisolution&b=suthnkwvck&c=recatch-form&tr=true&th=light&mode=sdk"
        strategy="afterInteractive"
      />
      <RecatchTemplate />
    </>
  );
}
