'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpdateCurrentPriceModal from '@/components/UpdateCurrentPriceModal';
import InvestmentModal from '@/components/InvestmentModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<Investment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteClick = (investment: Investment) => {
    setInvestmentToDelete(investment);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!investmentToDelete) return;

    setDeletingId(investmentToDelete.id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/investments/${investmentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete investment');
      }

      // Close modal and refresh the list
      setDeleteModalOpen(false);
      setInvestmentToDelete(null);
      fetchInvestments();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete investment');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setInvestmentToDelete(null);
    setDeleteError(null);
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
      <div className="lg:p-8 p-3">
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
          <div className="bg-white rounded-xl shadow-lg p-12 text-center h-[85vh] flex">
            <div className="max-w-md mx-auto my-auto">
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
          <InvestmentData investments={investments} handleEditClick={handleEditClick} handleDelete={handleDeleteClick} handleUpdatePriceClick={handleUpdatePriceClick} deletingId={deletingId} />
        )}

        {/* Delete Confirmation Modal */}
        {investmentToDelete && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            investmentName={investmentToDelete.name}
            isDeleting={deletingId === investmentToDelete.id}
          />
        )}

        {/* Delete Error Toast */}
        {deleteError && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
              <svg
                className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-sm">Error</p>
                <p className="text-sm">{deleteError}</p>
              </div>
              <button
                onClick={() => setDeleteError(null)}
                className="text-red-600 hover:text-red-800 flex-shrink-0"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
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
