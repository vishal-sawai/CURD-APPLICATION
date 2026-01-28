'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber, formatNumberCompact } from '@/lib/utils';

interface Stats {
  totalInvested: number;
  totalCurrent: number;
  overallProfitLoss: number;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setInvestments(investmentsData.investments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
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

  // Prepare chart data
  const typeDistribution = investments.reduce((acc: any, inv) => {
    const type = inv.type.replace(/_/g, ' ');
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, invested: 0 };
    }
    acc[type].value += inv.currentValue || inv.investedValue;
    acc[type].invested += inv.investedValue;
    return acc;
  }, {});

  const typeChartData = Object.values(typeDistribution);
  const topInvestments = [...investments]
    .sort((a, b) => b.investedValue - a.investedValue)
    .slice(0, 5);

  const profitLossData = [
    {
      name: 'Invested',
      value: stats?.totalInvested || 0,
      fill: '#6366F1',
    },
    {
      name: 'Current',
      value: stats?.totalCurrent || 0,
      fill: stats && stats.overallProfitLoss >= 0 ? '#10B981' : '#EF4444',
    },
  ];

  const profitPercentage =
    stats && stats.totalInvested > 0
      ? ((stats.overallProfitLoss / stats.totalInvested) * 100).toFixed(2)
      : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {session?.user?.email}</p>
          </div>
          <Link
            href="/investments/new"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            + Add Investment
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Invested</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats ? formatNumber(stats.totalInvested) : '0.00'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats ? formatNumber(stats.totalCurrent) : '0.00'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Profit / Loss</p>
                <p
                  className={`text-3xl font-bold ${
                    stats && stats.overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stats ? formatNumber(stats.overallProfitLoss) : '0.00'}
                </p>
                {stats && stats.totalInvested > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.overallProfitLoss >= 0 ? '+' : ''}
                    {profitPercentage}%
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full ${
                  stats && stats.overallProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <svg
                  className={`w-8 h-8 ${
                    stats && stats.overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      stats && stats.overallProfitLoss >= 0
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    }
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {stats && stats.totalInvested === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
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
              <Link
                href="/investments/new"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Your First Investment
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investment vs Current Value Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Type Distribution Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Distribution by Type</h3>
              {typeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Top Investments */}
            {topInvestments.length > 0 && (
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Investments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Invested
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Current
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          P/L
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topInvestments.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{inv.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {inv.type.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">
                            {formatNumber(inv.investedValue)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">
                            {inv.currentValue ? formatNumber(inv.currentValue) : '—'}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-medium ${
                              inv.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {inv.currentValue
                              ? `${inv.profitLoss >= 0 ? '+' : ''}${formatNumber(inv.profitLoss)}`
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
