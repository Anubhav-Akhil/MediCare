'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './TopNav';
import AppShell from './AppShell';
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
        {isLanding ? (
          <div className="min-h-screen flex flex-col">
            <WaterEffect />
            <TopNav />
            <main>{children}</main>
          </div>
        ) : isAuthPage ? (
          <div className="min-h-screen flex flex-col">
            <main>{children}</main>
          </div>
        ) : (
          <AppShell>{children}</AppShell>
        )}
      </ToastProvider>
    </AuthProvider>
  );
}
