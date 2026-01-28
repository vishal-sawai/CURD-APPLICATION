'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SidebarUserSectionProps {
  onSignOut?: () => void;
}

export default function SidebarUserSection({ onSignOut }: SidebarUserSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    onSignOut?.();
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
            {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {session?.user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
