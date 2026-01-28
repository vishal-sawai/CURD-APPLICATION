'use client';

import { useState, useEffect } from 'react';
import { InvestmentFormData } from '@/types/comman.interface';


interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  investmentId?: string;
  onSuccess: () => void;
}

export default function InvestmentModal({
  isOpen,
  onClose,
  investmentId,
  onSuccess,
}: InvestmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!investmentId);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<InvestmentFormData>({
    name: '',
    type: 'stock',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    buyDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen && investmentId) {
      fetchInvestment();
    } else if (isOpen && !investmentId) {
      // Reset form for new investment
      setFormData({
        name: '',
        type: 'stock',
        quantity: '',
        buyPrice: '',
        currentPrice: '',
        buyDate: new Date().toISOString().split('T')[0],
      });
      setError('');
      setFetching(false);
    }
  }, [isOpen, investmentId]);

  const fetchInvestment = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/investments/${investmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch investment');
      }
      const data = await response.json();
      const investment = data.investment;

      setFormData({
        name: investment.name,
        type: investment.type,
        quantity: investment.quantity.toString(),
        buyPrice: investment.buyPrice.toString(),
        currentPrice: investment.currentPrice ? investment.currentPrice.toString() : '',
        buyDate: new Date(investment.buyDate).toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investment');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: string; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = investmentId
        ? `/api/investments/${investmentId}`
        : '/api/investments';
      const method = investmentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          type: formData.type,
          quantity: parseFloat(formData.quantity),
          buyPrice: parseFloat(formData.buyPrice),
          currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : null,
          buyDate: formData.buyDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save investment');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  {investmentId ? 'Edit Investment' : 'Add New Investment'}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 hidden sm:block">
                  {investmentId ? 'Update your investment details' : 'Track your new investment'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Investment Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Apple Inc., Bitcoin, etc."
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                    Investment Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Crypto</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="etf">ETF</option>
                    <option value="fd">Fixed Deposit (FD)</option>
                    <option value="bonds">Bonds</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="buyDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Buy Date *
                  </label>
                  <input
                    type="date"
                    id="buyDate"
                    name="buyDate"
                    required
                    value={formData.buyDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="buyPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                    Buy Price (per unit) *
                  </label>
                  <input
                    type="number"
                    id="buyPrice"
                    name="buyPrice"
                    required
                    min="0"
                    step="0.01"
                    value={formData.buyPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                {investmentId && (
                  <div>
                    <label htmlFor="currentPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Price (per unit)
                    </label>
                    <input
                      type="number"
                      id="currentPrice"
                      name="currentPrice"
                      min="0"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0.00 (optional)"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to update later from the investments list
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Saving...' : investmentId ? 'Update Investment' : 'Add Investment'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
