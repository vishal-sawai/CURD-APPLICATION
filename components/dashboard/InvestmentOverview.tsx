import { formatNumber } from '@/lib/utils';
import { Stats } from '@/types/comman.interface';


export default function InvestmentOverview({ stats }: { stats: Stats }) {

    const profitPercentage =
        stats && stats.totalInvested > 0
            ? ((stats.overallProfitLoss / stats.totalInvested) * 100).toFixed(2)
            : '0.00';

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Investment Overview</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Invested</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
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

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Current Value</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
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

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Profit / Loss</p>
                            <p
                                className={`text-2xl sm:text-3xl font-bold ${stats && stats.overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {stats ? formatNumber(stats.overallProfitLoss) : '0.00'}
                            </p>
                            {stats && stats.totalInvested > 0 && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {stats.overallProfitLoss >= 0 ? '+' : ''}
                                    {profitPercentage}%
                                </p>
                            )}
                        </div>
                        <div
                            className={`p-3 rounded-full ${stats && stats.overallProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}
                        >
                            <svg
                                className={`w-8 h-8 ${stats && stats.overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
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
        </div>
    );
}