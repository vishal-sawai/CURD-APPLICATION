'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InvestmentModal from '@/components/InvestmentModal';
import Header from '@/components/dashboard/Header';
import { Stats, Investment } from '@/types/comman.interface';
import InvestmentOverview from '@/components/dashboard/InvestmentOverview';
import { typeDistribution } from '@/lib/utils';
import InvestmentPerformance from '@/components/dashboard/InvestmentPerformance';
import TypeDistribution from '@/components/dashboard/TypeDistribution';
import RecentInvestment from '@/components/dashboard/RecentInvestment';


export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [statsResponse, investmentsResponse] = await Promise.all([
        fetch('/api/investments/stats'),
        fetch('/api/investments'),
      ]);

      if (!statsResponse.ok || !investmentsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const statsData = await statsResponse.json();
      const investmentsData = await investmentsResponse.json();

      setStats(statsData);
      setInvestments((investmentsData.investments || []) as Investment[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentSuccess = () => {
    fetchData();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  const typeChartData = Object.values(typeDistribution(investments));
  const topInvestments = [...investments]
    .sort((a, b) => b.investedValue - a.investedValue)
    .slice(0, 5);




  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <Header setAddModalOpen={setAddModalOpen} />

        {/* Investment Overview Section */}
        {stats && <InvestmentOverview stats={stats} />}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Investment vs Current Value Chart */}
          {stats && <InvestmentPerformance stats={stats} />}


          {/* Type Distribution Pie Chart */}
          <TypeDistribution typeChartData={typeChartData} />

        </div>

        {/* Recent Investments */}
        {topInvestments.length > 0 && (
          <RecentInvestment topInvestments={topInvestments} />
        )}

        {stats && stats.totalInvested === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No investments yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your investments by adding your first one!
              </p>
            </div>
          </div>
        )}

        <InvestmentModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={handleInvestmentSuccess}
        />
      </div>
    </div>
  );
}
