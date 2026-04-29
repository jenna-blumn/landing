'use client';

import { usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith('/guide') || pathname.startsWith('/embed');

  if (hideFooter) return null;
  return <Footer />;
}
