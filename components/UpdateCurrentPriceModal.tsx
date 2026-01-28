'use client';

import { useState } from 'react';

interface UpdateCurrentPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  investmentName: string;
  investmentId: string;
  currentPrice?: number;
  onUpdate: () => void;
}

export default function UpdateCurrentPriceModal({
  isOpen,
  onClose,
  investmentName,
  investmentId,
  currentPrice,
  onUpdate,
}: UpdateCurrentPriceModalProps) {
  const [price, setPrice] = useState(currentPrice?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!price || parseFloat(price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/investments/${investmentId}/current-price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPrice: parseFloat(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update current price');
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Update Current Price
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Investment: <span className="font-semibold text-gray-900">{investmentName}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Current Price (per unit) *
            </label>
            <input
              type="number"
              id="currentPrice"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Updating...' : 'Update & Calculate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
