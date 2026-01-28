// API Request/Response Types
import type { InvestmentType } from '@/models/Investment';

export type { InvestmentType };

export interface CreateInvestmentRequest {
  name: string;
  type: InvestmentType;
  quantity: number;
  buyPrice: number;
  currentPrice?: number | null;
  buyDate: string;
}

export interface UpdateInvestmentRequest {
  name: string;
  type: InvestmentType;
  quantity: number;
  buyPrice: number;
  currentPrice?: number | null;
  buyDate: string;
}

export interface UpdateCurrentPriceRequest {
  currentPrice: number;
}

export interface InvestmentResponse {
  id: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  buyPrice: number;
  currentPrice: number | null;
  buyDate: string;
  userId: string;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  timeHeld: number;
  createdAt: string;
  updatedAt: string;
}

export interface StatsResponse {
  totalInvested: number;
  totalCurrent: number;
  overallProfitLoss: number;
}

export interface ErrorResponse {
  error: string;
}
