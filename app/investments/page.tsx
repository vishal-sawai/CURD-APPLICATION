'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpdateCurrentPriceModal from '@/components/UpdateCurrentPriceModal';
import InvestmentModal from '@/components/InvestmentModal';
import { Investment } from '@/types/comman.interface';
import InvestmentData from '@/components/investments/investment-data';


export default function InvestmentsPage() {
  const { status } = useSession();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investments');
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
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete investment');
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3">
        <div className="flex flex-col sm:flex-row justify-between  mb-4">
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
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Your First Investment
              </button>
            </div>
          </div>
        ) : (
          <InvestmentData investments={investments} handleEditClick={handleEditClick} handleDelete={handleDelete} handleUpdatePriceClick={handleUpdatePriceClick} deletingId={deletingId} />
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
