import mongoose, { Schema, Document, Model } from 'mongoose';

export type InvestmentType = 'stock' | 'crypto' | 'mutual_fund' | 'etf' | 'fd' | 'bonds' | 'real_estate' | 'other';

export interface IInvestment extends Document {
  name: string;
  type: InvestmentType;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  buyDate: Date;
  userId: mongoose.Types.ObjectId;
  // Calculated fields (virtuals)
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  timeHeld: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema: Schema<IInvestment> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Investment name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['stock', 'crypto', 'mutual_fund', 'etf', 'fd', 'bonds', 'real_estate', 'other'],
      required: [true, 'Investment type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than 0'],
    },
    buyPrice: {
      type: Number,
      required: [true, 'Buy price is required'],
      min: [0, 'Buy price must be greater than or equal to 0'],
    },
    currentPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function(value: number | null | undefined) {
          return value === null || value === undefined || value >= 0;
        },
        message: 'Current price must be greater than or equal to 0',
      },
    },
    buyDate: {
      type: Date,
      required: [true, 'Buy date is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for investedValue
InvestmentSchema.virtual('investedValue').get(function (this: IInvestment) {
  return this.buyPrice * this.quantity;
});

// Virtual for currentValue
InvestmentSchema.virtual('currentValue').get(function (this: IInvestment) {
  if (!this.currentPrice) return 0;
  return this.currentPrice * this.quantity;
});

// Virtual for profitLoss
InvestmentSchema.virtual('profitLoss').get(function (this: IInvestment) {
  if (!this.currentPrice) return 0;
  return this.currentValue - this.investedValue;
});

// Virtual for timeHeld (in days)
InvestmentSchema.virtual('timeHeld').get(function (this: IInvestment) {
  const today = new Date();
  const buyDate = new Date(this.buyDate);
  const diffTime = Math.abs(today.getTime() - buyDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included in JSON
InvestmentSchema.set('toJSON', { virtuals: true });
InvestmentSchema.set('toObject', { virtuals: true });

const Investment: Model<IInvestment> =
  mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);

export default Investment;
