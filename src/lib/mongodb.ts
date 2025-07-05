import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'next-it';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}
