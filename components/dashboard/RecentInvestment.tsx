import { formatNumber } from '@/lib/utils';
import { Investment } from '@/types/comman.interface';

export default function RecentInvestment({ topInvestments }: { topInvestments: Investment[] }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Investments</h3>
                    <p className="text-sm text-gray-500 mt-1">Investments added this month</p>
                </div>
            </div>
            <div className="space-y-4">
                {topInvestments.slice(0, 5).map((inv) => (
                    <div
                        key={inv.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">
                                {inv.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{inv.name}</p>
                                <p className="text-sm text-gray-500">{inv.type.replace(/_/g, ' ')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatNumber(inv.investedValue)}</p>
                            <p
                                className={`text-sm font-medium ${inv.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {inv.currentValue
                                    ? `${inv.profitLoss >= 0 ? '+' : ''}${formatNumber(inv.profitLoss)}`
                                    : '—'}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}