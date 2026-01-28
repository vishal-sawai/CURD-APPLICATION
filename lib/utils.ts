import { Investment } from "@/types/comman.interface";

// Format number without currency symbol
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};


  // Prepare chart data
 export const typeDistribution = (investments: Investment[]) => {
  return investments.reduce((acc: Record<string, { name: string; value: number; invested: number }>, inv) => {
    const type = inv.type.replace(/_/g, ' ');
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, invested: 0 };
    }
    acc[type].value += inv.currentValue || inv.investedValue;
    acc[type].invested += inv.investedValue;
    return acc;
  }, {});
}
