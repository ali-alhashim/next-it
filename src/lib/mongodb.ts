import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'next-it';

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}
