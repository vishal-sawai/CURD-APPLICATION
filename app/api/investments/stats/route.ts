import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Investment from '@/models/Investment';

// GET dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const investments = await Investment.find({ userId: session.user.id }).lean();

    // Calculate totals
    let totalInvested = 0;
    let totalCurrent = 0;

    investments.forEach((inv) => {
      const investedValue = inv.buyPrice * inv.quantity;
      const currentValue = inv.currentPrice ? inv.currentPrice * inv.quantity : 0;
      totalInvested += investedValue;
      totalCurrent += currentValue;
    });

    const overallProfitLoss = totalCurrent - totalInvested;

    return NextResponse.json({
      totalInvested,
      totalCurrent,
      overallProfitLoss,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
