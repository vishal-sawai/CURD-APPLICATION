import { Investment } from '@/types/comman.interface';
import { formatNumber } from '@/lib/utils';


export default function InvestmentData({ investments, handleEditClick, handleDelete, handleUpdatePriceClick, deletingId }: { investments: Investment[], handleEditClick: (investment: Investment) => void, handleDelete: (investment: Investment) => void, handleUpdatePriceClick: (investment: Investment) => void, deletingId: string | null }) {
    return (
        <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {investments.map((investment) => (
                    <div key={investment.id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{investment.name}</h3>
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                                    {investment.type.replace(/_/g, ' ')}
                                </span>
                                <button
                                    onClick={() => handleEditClick(investment)}
                                    className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-medium whitespace-nowrap"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(investment)}
                                    disabled={deletingId === investment.id}
                                    className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Invested Value</span>
                                <span className="text-sm font-semibold text-gray-900">{formatNumber(investment.investedValue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Current Value</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {investment.currentPrice ? formatNumber(investment.currentValue) : <span className="text-gray-400 italic">Not set</span>}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Profit / Loss</span>
                                <span className={`text-sm font-semibold ${investment.currentPrice
                                    ? investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                    : 'text-gray-400'
                                    }`}>
                                    {investment.currentPrice ? (
                                        <>
                                            {investment.profitLoss >= 0 ? '+' : ''}
                                            {formatNumber(investment.profitLoss)}
                                        </>
                                    ) : (
                                        <span className="italic">Calculate to see</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Time Held</span>
                                <span className="text-sm text-gray-700">{investment.timeHeld} days</span>
                            </div>
                            <button
                                onClick={() => handleUpdatePriceClick(investment)}
                                className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                {investment.currentPrice ? 'Update Price' : 'Calculate P/L'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
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
                                <tr key={investment.id} className="hover:bg-gray-50">
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
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${investment.currentPrice
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
                                                    onClick={() => handleDelete(investment)}
                                                    disabled={deletingId === investment.id}
                                                    className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                                                >
                                                    Delete
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
        </>
    );
}