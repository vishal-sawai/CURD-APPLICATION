export interface Stats {
    totalInvested: number;
    totalCurrent: number;
    overallProfitLoss: number;
  }

  export interface Investment {
    id: string;
    name: string;
    type: string;
    quantity: number;
    buyPrice: number;
    currentPrice: number;
    buyDate: string;
    investedValue: number;
    currentValue: number;
    profitLoss: number;
    timeHeld: number;
  }
  