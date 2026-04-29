'use client';

import Header from '@/components/layout/Header';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import Background from '@/components/layout/Background';
import useHappytalk from '@/hooks/useHappytalk';
import { useLayoutStore } from '@/stores/layoutStore';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useHappytalk();

  const { isDesktop } = useLayoutStore();

  if (isDesktop === null) return null;

  return (
    <>
      <Background />
      <Header />
      <main>{children}</main>
      <ConditionalFooter />
    </>
  );
}
