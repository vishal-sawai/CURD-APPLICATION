# Investment Tracking Management Platform

A full-stack Next.js application for tracking and managing personal investments.

## Features

- **Authentication**: Email and password-based user authentication
- **Investment CRUD**: Create, read, update, and delete investments
- **Dashboard**: View total invested amount, current value, and overall profit/loss
- **Investment List**: Table view of all investments with calculated metrics
- **Calculations**: Automatic calculation of invested value, current value, profit/loss, and time held

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

**MongoDB Setup:**
- For local MongoDB: `mongodb://localhost:27017/investment-tracker`
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/investment-tracker`

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth configuration
│   │   │   └── register/route.ts       # User registration
│   │   └── investments/
│   │       ├── route.ts                 # GET all, POST create
│   │       ├── [id]/route.ts            # GET, PUT, DELETE by ID
│   │       └── stats/route.ts           # Dashboard statistics
│   ├── dashboard/page.tsx               # Dashboard page
│   ├── investments/
│   │   ├── page.tsx                     # Investments list
│   │   ├── new/page.tsx                 # Add investment
│   │   └── [id]/edit/page.tsx           # Edit investment
│   ├── login/page.tsx                   # Login page
│   └── register/page.tsx                # Registration page
├── components/
│   ├── InvestmentForm.tsx               # Reusable form component
│   ├── Navbar.tsx                       # Navigation bar
│   └── SessionProvider.tsx              # NextAuth session provider
├── lib/
│   └── mongodb.ts                       # MongoDB connection utility
├── models/
│   ├── User.ts                          # User schema
│   └── Investment.ts                    # Investment schema
└── types/
    └── next-auth.d.ts                   # NextAuth TypeScript types
```

## Investment Fields

- **name**: Investment name (e.g., "Apple Inc.", "Bitcoin")
- **type**: Investment type (stock, crypto, mutual_fund, other)
- **quantity**: Number of units owned
- **buyPrice**: Price per unit at purchase
- **currentPrice**: Current price per unit (manually entered)
- **buyDate**: Date of purchase

## Calculated Fields

All calculations are performed server-side:

- **investedValue** = buyPrice × quantity
- **currentValue** = currentPrice × quantity
- **profitLoss** = currentValue - investedValue
- **timeHeld** = Days between buyDate and today

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Investments
- `GET /api/investments` - Get all investments for logged-in user
- `POST /api/investments` - Create new investment
- `GET /api/investments/[id]` - Get single investment
- `PUT /api/investments/[id]` - Update investment
- `DELETE /api/investments/[id]` - Delete investment
- `GET /api/investments/stats` - Get dashboard statistics

## Security

- All investment routes require authentication
- Users can only access their own investments
- Passwords are hashed using bcrypt
- Session management via NextAuth.js

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Notes

- No external market APIs are used - users manually enter current prices
- Calculations are performed server-side for accuracy
- Clean, simple UI with Tailwind CSS
- TypeScript for type safety
- RESTful API conventions
