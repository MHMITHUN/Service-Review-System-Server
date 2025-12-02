import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = null;

export const connectDB = async () => {
    try {
        await client.connect();
        db = client.db('service-review');
        console.log('✅ Successfully connected to MongoDB!');

        // Create indexes
        await db.collection('services').createIndex({ title: 'text', description: 'text', category: 'text', company: 'text' });
        await db.collection('services').createIndex({ userEmail: 1 });
        await db.collection('reviews').createIndex({ serviceId: 1 });
        await db.collection('reviews').createIndex({ userEmail: 1 });

        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

export { client };
