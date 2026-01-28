import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';

// GET all investments for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const investments = await Investment.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate virtual fields for each investment
    const investmentsWithCalculations = investments.map((inv) => {
      const investedValue = inv.buyPrice * inv.quantity;
      const currentValue = inv.currentPrice ? inv.currentPrice * inv.quantity : 0;
      const profitLoss = inv.currentPrice ? currentValue - investedValue : 0;
      const today = new Date();
      const buyDate = new Date(inv.buyDate);
      const diffTime = Math.abs(today.getTime() - buyDate.getTime());
      const timeHeld = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...inv,
        id: inv._id.toString(),
        investedValue,
        currentValue,
        profitLoss,
        timeHeld,
      };
    });

    return NextResponse.json({ investments: investmentsWithCalculations });
  } catch (error: any) {
    console.error('Get investments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

// POST create new investment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, quantity, buyPrice, currentPrice, buyDate  } = body;

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

    const investmentData: any = {
      name,
      type,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      buyDate: new Date(buyDate),
      userId: session.user.id,
    };

    // Only include currentPrice if it's provided
    if (currentPrice !== undefined && currentPrice !== null) {
      investmentData.currentPrice = Number(currentPrice);
    }

    const investment = await Investment.create(investmentData);

    // Calculate virtual fields
    const investedValue = investment.buyPrice * investment.quantity;
    const currentValue = investment.currentPrice ? investment.currentPrice * investment.quantity : 0;
    const profitLoss = investment.currentPrice ? currentValue - investedValue : 0;
    const today = new Date();
    const buyDateObj = new Date(investment.buyDate);
    const diffTime = Math.abs(today.getTime() - buyDateObj.getTime());
    const timeHeld = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return NextResponse.json(
      {
        investment: {
          ...investment.toObject(),
          id: investment._id.toString(),
          investedValue,
          currentValue,
          profitLoss,
          timeHeld,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create investment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create investment' },
      { status: 500 }
    );
  }
}
