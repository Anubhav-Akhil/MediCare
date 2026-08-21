import mongoose from 'mongoose';

const PRIMARY_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pms';
const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/pms';

/**
 * Global cache for Mongoose connection across hot reloads in Next.js development.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn && cached!.conn.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const primaryOpts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached!.promise = (async () => {
      try {
        const instance = await mongoose.connect(PRIMARY_URI, primaryOpts);
        console.log('[MongoDB] Connected successfully to:', PRIMARY_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : PRIMARY_URI);
        return instance;
      } catch (primaryError) {
        // If primary URI is different from local fallback, attempt local fallback
        if (PRIMARY_URI !== LOCAL_FALLBACK_URI) {
          console.warn('[MongoDB] Primary connection failed, attempting local fallback (127.0.0.1:27017)...');
          try {
            const fallbackInstance = await mongoose.connect(LOCAL_FALLBACK_URI, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 2000,
            });
            console.log('[MongoDB] Connected successfully to local fallback: mongodb://127.0.0.1:27017/pms');
            return fallbackInstance;
          } catch {
            // Re-throw the original error if fallback also fails
            throw primaryError;
          }
        }
        throw primaryError;
      }
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    cached!.conn = null;
    throw error;
  }

  return cached!.conn;
}

export default connectToDatabase;


