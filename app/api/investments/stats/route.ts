import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import {
  getAuthenticatedUserId,
  createUnauthorizedResponse,
  createErrorResponse,
  calculateInvestmentFields,
} from '@/lib/api-utils';

// GET dashboard statistics
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createUnauthorizedResponse();
    }

    await connectDB();

    const investments = await Investment.find({ userId }).lean();

    // Calculate totals efficiently
    const totals = investments.reduce(
      (acc, inv) => {
        const calculations = calculateInvestmentFields(
          inv.buyPrice,
          inv.quantity,
          inv.currentPrice,
          inv.buyDate
        );
        acc.totalInvested += calculations.investedValue;
        acc.totalCurrent += calculations.currentValue;
        return acc;
      },
      { totalInvested: 0, totalCurrent: 0 }
    );

    const overallProfitLoss = totals.totalCurrent - totals.totalInvested;

    return NextResponse.json({
      totalInvested: totals.totalInvested,
      totalCurrent: totals.totalCurrent,
      overallProfitLoss,
    });
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch statistics');
  }
}
