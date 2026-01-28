import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MONGODB_URI format. Must start with "mongodb://" or "mongodb+srv://"');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Extract database name from URI or use default
    const dbName = MONGODB_URI?.split('/').pop()?.split('?')[0] || 'investment-tracker';
    
    const opts = {
      bufferCommands: false,
      dbName: dbName,
    };

      cached.promise = mongoose.connect(MONGODB_URI || '', opts).then((mongoose) => {
        return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
