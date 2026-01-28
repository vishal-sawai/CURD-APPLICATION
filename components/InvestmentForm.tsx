'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

interface InvestmentFormData {
  name: string;
  type: 'stock' | 'crypto' | 'mutual_fund' | 'etf' | 'fd' | 'bonds' | 'real_estate' | 'other';
  quantity: string;
  buyPrice: string;
  currentPrice: string;
  buyDate: string;
}

interface InvestmentFormProps {
  investmentId?: string;
}

export default function InvestmentForm({ investmentId }: InvestmentFormProps) {
  const router = useRouter();
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
    if (investmentId) {
      fetchInvestment();
    }
  }, [investmentId]);

  const fetchInvestment = async () => {
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
    } catch (err: any) {
      setError(err.message || 'Failed to load investment');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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

      router.push('/investments');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Investment Type *
        </label>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="buyDate" className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
              Leave empty if you want to update it later from the investments list
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
        >
          {loading ? 'Saving...' : investmentId ? 'Update Investment' : 'Create Investment'}
        </button>
      </div>
    </form>
  );
}
