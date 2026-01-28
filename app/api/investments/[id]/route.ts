import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';
import mongoose from 'mongoose';

// GET single investment
export async function GET(
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

    await connectDB();

    const investment = await Investment.findOne({
      _id: id,
      userId: session.user.id,
    });

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
  } catch (error: any) {
    console.error('Get investment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch investment' },
      { status: 500 }
    );
  }
}

// PUT update investment
export async function PUT(
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

    const body = await request.json();
    const { name, type, quantity, buyPrice, currentPrice, buyDate } = body;

    // Validation
    if (!name || !type || !quantity || !buyPrice || !buyDate) {
      return NextResponse.json(
        { error: 'Name, type, quantity, buy price, and buy date are required' },
        { status: 400 }
      );
    }

    if (!['stock', 'crypto', 'mutual_fund', 'etf', 'fd', 'bonds', 'real_estate', 'other'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid investment type' },
        { status: 400 }
      );
    }

    if (quantity <= 0 || buyPrice < 0 || (currentPrice !== undefined && currentPrice !== null && currentPrice < 0)) {
      return NextResponse.json(
        { error: 'Quantity and prices must be valid positive numbers' },
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
        name,
        type,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        currentPrice: currentPrice !== undefined && currentPrice !== null ? Number(currentPrice) : null,
        buyDate: new Date(buyDate),
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
  } catch (error: any) {
    console.error('Update investment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update investment' },
      { status: 500 }
    );
  }
}

// DELETE investment
export async function DELETE(
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

    await connectDB();

    const investment = await Investment.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error: any) {
    console.error('Delete investment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete investment' },
      { status: 500 }
    );
  }
}
