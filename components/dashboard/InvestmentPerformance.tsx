import { formatNumber } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Stats } from '@/types/comman.interface';

export default function InvestmentPerformance({ stats }: { stats: Stats }) {
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

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Investment Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }} data={profitLossData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        formatter={(value: number | undefined) => value !== undefined ? formatNumber(value) : ''}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                        }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366F1" />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}