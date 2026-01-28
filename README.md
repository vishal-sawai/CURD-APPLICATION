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
