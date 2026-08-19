'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './TopNav';
import { ToastProvider } from './Toast';
import { AuthProvider } from '@/lib/auth-context';
import WaterEffect from './WaterEffect';
import { seedData } from '@/lib/storage';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    seedData();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <WaterEffect />
          {!isAuthPage && <TopNav />}
          <main className={isLanding || isAuthPage ? '' : 'pt-[72px]'}>{children}</main>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
