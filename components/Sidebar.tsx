'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import MobileMenuButton from './MobileMenuButton';
import MobileSidebarOverlay from './MobileSidebarOverlay';
import SidebarNavigation from './SidebarNavigation';
import SidebarUserSection from './SidebarUserSection';
import Logo from './Logo';

export default function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes - MUST be called before any conditional returns
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register' || status !== 'authenticated') {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/investments', label: 'Investments', icon: '💰' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuButton
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <MobileSidebarOverlay
        isOpen={isMobileMenuOpen}
        onClick={handleCloseMobileMenu}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white shadow-xl h-screen fixed left-0 top-0 flex-col z-40">
        <Logo />
        <hr className=" border-gray-200" />
        <SidebarNavigation navItems={navItems} isActive={isActive} />
        <SidebarUserSection />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="m-4 border-b border-gray-200 ">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={handleCloseMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between h-[calc(100vh-100px)] ">
          <SidebarNavigation navItems={navItems} isActive={isActive} onLinkClick={handleCloseMobileMenu} />
          <SidebarUserSection onSignOut={handleCloseMobileMenu} />
        </div>
      </div>
    </>
  );
}
