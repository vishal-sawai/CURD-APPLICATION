import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
import type { InvestmentType } from '@/types/api';

// Investment calculation utilities
export interface InvestmentCalculations {
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  timeHeld: number;
}

export function calculateInvestmentFields(
  buyPrice: number,
  quantity: number,
  currentPrice: number | null | undefined,
  buyDate: Date | string
): InvestmentCalculations {
  const investedValue = buyPrice * quantity;
  const currentValue = currentPrice ? currentPrice * quantity : 0;
  const profitLoss = currentPrice ? currentValue - investedValue : 0;
  
  const today = new Date();
  const buyDateObj = typeof buyDate === 'string' ? new Date(buyDate) : buyDate;
  const diffTime = Math.abs(today.getTime() - buyDateObj.getTime());
  const timeHeld = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    investedValue,
    currentValue,
    profitLoss,
    timeHeld,
  };
}

export function transformInvestment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  investment: any,
  calculations: InvestmentCalculations
) {
  const investmentObj = investment.toObject ? investment.toObject() : investment;
  const id = typeof investment._id === 'object' && investment._id?.toString
    ? investment._id.toString()
    : typeof investment._id === 'string'
    ? investment._id
    : investment.id || '';

  return {
    ...investmentObj,
    id,
    ...calculations,
  };
}

// Validation utilities
export const VALID_INVESTMENT_TYPES: InvestmentType[] = [
  'stock',
  'crypto',
  'mutual_fund',
  'etf',
  'fd',
  'bonds',
  'real_estate',
  'other',
];

export function validateInvestmentType(type: string): type is InvestmentType {
  return VALID_INVESTMENT_TYPES.includes(type as InvestmentType);
}

export function validateInvestmentData(data: {
  name?: string;
  type?: string;
  quantity?: unknown;
  buyPrice?: unknown;
  buyDate?: string;
  currentPrice?: unknown;
}): { isValid: boolean; error?: string } {
  if (!data.name || !data.type || data.quantity === undefined || data.buyPrice === undefined || !data.buyDate) {
    return {
      isValid: false,
      error: 'Name, type, quantity, buy price, and buy date are required',
    };
  }

  if (!validateInvestmentType(data.type)) {
    return {
      isValid: false,
      error: 'Invalid investment type',
    };
  }

  const numQuantity = Number(data.quantity);
  const numBuyPrice = Number(data.buyPrice);
  const numCurrentPrice =
    data.currentPrice !== undefined && data.currentPrice !== null ? Number(data.currentPrice) : null;

  if (isNaN(numQuantity) || numQuantity <= 0) {
    return {
      isValid: false,
      error: 'Quantity must be a valid positive number',
    };
  }

  if (isNaN(numBuyPrice) || numBuyPrice < 0) {
    return {
      isValid: false,
      error: 'Buy price must be a valid number greater than or equal to 0',
    };
  }

  if (numCurrentPrice !== null && (isNaN(numCurrentPrice) || numCurrentPrice < 0)) {
    return {
      isValid: false,
      error: 'Current price must be a valid number greater than or equal to 0',
    };
  }

  return { isValid: true };
}

export function validateObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function validateCurrentPrice(price: unknown): { isValid: boolean; value?: number; error?: string } {
  if (price === undefined || price === null) {
    return {
      isValid: false,
      error: 'Current price is required',
    };
  }

  const numPrice = Number(price);

  if (isNaN(numPrice) || numPrice < 0) {
    return {
      isValid: false,
      error: 'Current price must be a valid number greater than or equal to 0',
    };
  }

  return { isValid: true, value: numPrice };
}

// Auth utilities
export async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function createErrorResponse(error: unknown, defaultMessage: string, status = 500) {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  console.error(`${defaultMessage}:`, error);
  return NextResponse.json({ error: errorMessage }, { status });
}

export function createNotFoundResponse(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function createBadRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
