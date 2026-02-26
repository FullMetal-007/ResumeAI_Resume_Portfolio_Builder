/**
 * MongoDB singleton connection for Next.js
 * Caches the connection across hot-reloads in development.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
    console.warn("[MongoDB] MONGODB_URI not set — database features will be unavailable.");
}

// Cache connection on the global object to survive Next.js hot-reloads
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
    if (!MONGODB_URI) return null;

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export function isDBConfigured(): boolean {
    return MONGODB_URI.startsWith("mongodb");
}
