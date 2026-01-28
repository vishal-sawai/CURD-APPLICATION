import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import type { UpdateInvestmentRequest, InvestmentType } from '@/types/api';
import {
  getAuthenticatedUserId,
  createUnauthorizedResponse,
  createErrorResponse,
  createNotFoundResponse,
  createBadRequestResponse,
  validateInvestmentData,
  validateObjectId,
  calculateInvestmentFields,
  transformInvestment,
} from '@/lib/api-utils';

// GET single investment
export async function GET(
  _request: NextRequest,
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

    await connectDB();

    const investment = await Investment.findOne({
      _id: id,
      userId,
    });

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
    return createErrorResponse(error, 'Failed to fetch investment');
  }
}

// PUT update investment
export async function PUT(
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

    const body = (await request.json()) as Partial<UpdateInvestmentRequest>;
    const { name, type, quantity, buyPrice, currentPrice, buyDate } = body;

    // Validation
    const validation = validateInvestmentData({ name, type, quantity, buyPrice, buyDate, currentPrice });
    if (!validation.isValid) {
      return createBadRequestResponse(validation.error!);
    }

    const numQuantity = Number(quantity);
    const numBuyPrice = Number(buyPrice);
    const numCurrentPrice = currentPrice !== undefined && currentPrice !== null ? Number(currentPrice) : null;

    await connectDB();

    const investment = await Investment.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        name: name!.trim(),
        type: type as InvestmentType,
        quantity: numQuantity,
        buyPrice: numBuyPrice,
        currentPrice: numCurrentPrice,
        buyDate: new Date(buyDate!),
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
    return createErrorResponse(error, 'Failed to update investment');
  }
}

// DELETE investment
export async function DELETE(
  _request: NextRequest,
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

    await connectDB();

    const investment = await Investment.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!investment) {
      return createNotFoundResponse('Investment');
    }

    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    return createErrorResponse(error, 'Failed to delete investment');
  }
}
