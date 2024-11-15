import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://prompt:123@cluster0.admu7.mongodb.net/flashcards';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if(cached){
    if (cached.conn) {
        return cached.conn;
      }
    
      if (!cached.promise) {
        const opts = {
          bufferCommands: false,
        };
    
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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
}

export default connectDB;
