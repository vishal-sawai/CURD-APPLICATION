'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              💼 Investment Tracker
            </Link>
            {status === 'authenticated' && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/investments"
                  className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  💰 Investments
                </Link>
                <Link
                  href="/investments/new"
                  className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ➕ Add Investment
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{session?.user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
