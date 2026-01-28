import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import type { UpdateCurrentPriceRequest } from '@/types/api';
import {
  getAuthenticatedUserId,
  createUnauthorizedResponse,
  createErrorResponse,
  createNotFoundResponse,
  createBadRequestResponse,
  validateObjectId,
  validateCurrentPrice,
  calculateInvestmentFields,
  transformInvestment,
} from '@/lib/api-utils';

// PATCH update only current price
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createUnauthorizedResponse();
    }

    const { id } = await params;

    if (!validateObjectId(id)) {
      return createBadRequestResponse('Invalid investment ID');
    }

    const body = (await request.json()) as Partial<UpdateCurrentPriceRequest>;
    const { currentPrice } = body;

    const priceValidation = validateCurrentPrice(currentPrice);
    if (!priceValidation.isValid) {
      return createBadRequestResponse(priceValidation.error!);
    }

    await connectDB();

    const investment = await Investment.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        currentPrice: priceValidation.value,
      },
      { new: true, runValidators: true }
    );

    if (!investment) {
      return createNotFoundResponse('Investment');
    }

    const calculations = calculateInvestmentFields(
      investment.buyPrice,
      investment.quantity,
      investment.currentPrice,
      investment.buyDate
    );

    return NextResponse.json({
      investment: transformInvestment(investment, calculations),
    });
  } catch (error) {
    return createErrorResponse(error, 'Failed to update current price');
  }
}
