'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  return (
    <main className={isAuthPage ? '' : 'lg:ml-64 pt-16 lg:pt-0'}>
      {children}
    </main>
  );
}
