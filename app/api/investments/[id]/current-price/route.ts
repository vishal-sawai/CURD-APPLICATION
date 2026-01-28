import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import mongoose from 'mongoose';
import type { UpdateCurrentPriceRequest } from '@/types/api';

// PATCH update only current price
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid investment ID' }, { status: 400 });
    }

    const body = (await request.json()) as Partial<UpdateCurrentPriceRequest>;
    const { currentPrice } = body;

    if (currentPrice === undefined || currentPrice === null) {
      return NextResponse.json(
        { error: 'Current price is required' },
        { status: 400 }
      );
    }

    const numCurrentPrice = Number(currentPrice);

    if (isNaN(numCurrentPrice) || numCurrentPrice < 0) {
      return NextResponse.json(
        { error: 'Current price must be a valid number greater than or equal to 0' },
        { status: 400 }
      );
    }

    await connectDB();

    const investment = await Investment.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      {
        currentPrice: numCurrentPrice,
      },
      { new: true, runValidators: true }
    );

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Calculate virtual fields
    const investedValue = investment.buyPrice * investment.quantity;
    const currentValue = investment.currentPrice ? investment.currentPrice * investment.quantity : 0;
    const profitLoss = investment.currentPrice ? currentValue - investedValue : 0;
    const today = new Date();
    const buyDateObj = new Date(investment.buyDate);
    const diffTime = Math.abs(today.getTime() - buyDateObj.getTime());
    const timeHeld = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      investment: {
        ...investment.toObject(),
        id: investment._id.toString(),
        investedValue,
        currentValue,
        profitLoss,
        timeHeld,
      },
    });
  } catch (error) {
    console.error('Update current price error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update current price';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
