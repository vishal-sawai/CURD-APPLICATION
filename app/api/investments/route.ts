import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import type { CreateInvestmentRequest, InvestmentType } from '@/types/api';
import {
  getAuthenticatedUserId,
  createUnauthorizedResponse,
  createErrorResponse,
  validateInvestmentData,
  calculateInvestmentFields,
  transformInvestment,
} from '@/lib/api-utils';

// GET all investments for the logged-in user
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createUnauthorizedResponse();
    }

    await connectDB();

    const investments = await Investment.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const investmentsWithCalculations = investments.map((inv) => {
      const calculations = calculateInvestmentFields(
        inv.buyPrice,
        inv.quantity,
        inv.currentPrice,
        inv.buyDate
      );
      return transformInvestment(inv, calculations);
    });

    return NextResponse.json({ investments: investmentsWithCalculations });
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch investments');
  }
}

// POST create new investment
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createUnauthorizedResponse();
    }

    const body = (await request.json()) as Partial<CreateInvestmentRequest>;
    const { name, type, quantity, buyPrice, currentPrice, buyDate } = body;

    // Validation
    const validation = validateInvestmentData({ name, type, quantity, buyPrice, buyDate, currentPrice });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const numQuantity = Number(quantity);
    const numBuyPrice = Number(buyPrice);
    const numCurrentPrice = currentPrice !== undefined && currentPrice !== null ? Number(currentPrice) : null;

    await connectDB();

    const investmentData = {
      name: name!.trim(),
      type: type as InvestmentType,
      quantity: numQuantity,
      buyPrice: numBuyPrice,
      buyDate: new Date(buyDate!),
      userId,
      ...(numCurrentPrice !== null && { currentPrice: numCurrentPrice }),
    };

    const investment = await Investment.create(investmentData);
    const calculations = calculateInvestmentFields(
      investment.buyPrice,
      investment.quantity,
      investment.currentPrice,
      investment.buyDate
    );

    return NextResponse.json(
      {
        investment: transformInvestment(investment, calculations),
      },
      { status: 201 }
    );
  } catch (error) {
    return createErrorResponse(error, 'Failed to create investment');
  }
}
