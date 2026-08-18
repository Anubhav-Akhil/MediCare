'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './TopNav';
import { ToastProvider } from './Toast';
import WaterEffect from './WaterEffect';
import { seedData } from '@/lib/storage';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  useEffect(() => {
    seedData();
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <WaterEffect />
        <TopNav />
        <main className={isLanding ? '' : 'pt-[72px]'}>{children}</main>
      </div>
    </ToastProvider>
  );
}
