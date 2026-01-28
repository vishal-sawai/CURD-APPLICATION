import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/utils';

const COLORS = ['#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4', '#3B82F6', '#EC4899'];

export default function TypeDistribution({ typeChartData }: { typeChartData: { name: string; value: number }[] }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Distribution by Type</h3>
            {typeChartData.length > 0 ? (
                <>
                    <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                        <PieChart>
                            <Pie
                                data={typeChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // Remove the label prop from Pie itself as labels are now below
                                outerRadius={110}
                                innerRadius={0}
                                fill="#8884d8"
                                dataKey="value"
                                paddingAngle={2}
                            >
                                {typeChartData.map((entry, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined, name: string | undefined, props?: { payload?: { name?: string } }) => {
                                    if (value === undefined) return '';
                                    const typeName = props?.payload?.name || name || '';
                                    return `${typeName} : ${formatNumber(value)}`;
                                }}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                                labelStyle={{
                                    fontWeight: 600,
                                    color: '#1f2937',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Legend/label below the chart */}
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        {typeChartData.map((entry, index: number) => {
                            const total = typeChartData.reduce((sum, d) => sum + d.value, 0);
                            const percentage = total === 0 ? 0 : ((entry.value / total) * 100);
                            return (
                                <div key={entry.name} className="flex  space-x-2">
                                    <span
                                        className="inline-block w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></span>
                                    <span className="text-sm font-medium text-gray-800 capitalize">{entry.name}</span>
                                    <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                </div>
            )}
        </div>
    );
}