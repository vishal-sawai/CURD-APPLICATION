'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpdateCurrentPriceModal from '@/components/UpdateCurrentPriceModal';
import InvestmentModal from '@/components/InvestmentModal';
import { formatNumber } from '@/lib/utils';

interface Investment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: string;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  timeHeld: number;
}

export default function InvestmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [editingInvestmentId, setEditingInvestmentId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchInvestments();
    }
  }, [status, router]);

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments');
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      const data = await response.json();
      setInvestments(data.investments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete investment');
      }

      // Refresh the list
      fetchInvestments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete investment');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdatePriceClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setUpdateModalOpen(true);
  };

  const handlePriceUpdate = () => {
    fetchInvestments();
  };

  const handleEditClick = (investment: Investment) => {
    setEditingInvestmentId(investment.id);
    setEditModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    fetchInvestments();
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Investments</h1>
            <p className="text-gray-600 mt-1">Manage and track all your investments</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Investment
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {investments.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No investments found</h3>
              <p className="text-gray-600 mb-6">Start tracking your investments today!</p>
              <Link
                href="/investments/new"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Your First Investment
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Invested Value
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Profit / Loss
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Time Held
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map((investment) => (
                    <tr key={investment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {investment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                          {investment.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatNumber(investment.investedValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {investment.currentPrice ? (
                          formatNumber(investment.currentValue)
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                          investment.currentPrice
                            ? investment.profitLoss >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {investment.currentPrice ? (
                          <span>
                            {investment.profitLoss >= 0 ? '+' : ''}
                            {formatNumber(investment.profitLoss)}
                          </span>
                        ) : (
                          <span className="italic">Calculate to see</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investment.timeHeld} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(investment)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(investment.id)}
                              disabled={deletingId === investment.id}
                              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {deletingId === investment.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleUpdatePriceClick(investment)}
                            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-md text-xs font-medium transition-colors"
                          >
                            {investment.currentPrice ? 'Update Price' : 'Calculate P/L'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedInvestment && (
          <UpdateCurrentPriceModal
            isOpen={updateModalOpen}
            onClose={() => {
              setUpdateModalOpen(false);
              setSelectedInvestment(null);
            }}
            investmentName={selectedInvestment.name}
            investmentId={selectedInvestment.id}
            currentPrice={selectedInvestment.currentPrice}
            onUpdate={handlePriceUpdate}
          />
        )}

        <InvestmentModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={handleInvestmentSuccess}
        />

        {editingInvestmentId && (
          <InvestmentModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setEditingInvestmentId(null);
            }}
            investmentId={editingInvestmentId}
            onSuccess={handleInvestmentSuccess}
          />
        )}
      </div>
    </div>
  );
}
