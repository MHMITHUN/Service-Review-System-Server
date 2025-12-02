import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

// Create MongoDB client without strict mode (text indexes not supported in strict mode)
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    }
});

let db = null;

export const connectDB = async () => {
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');

        await client.connect();
        db = client.db('service-review');

        // Ping to confirm connection
        await db.command({ ping: 1 });

        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Database Name: service-review');
        console.log('🌐 MongoDB Atlas: Connected');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');

        // Create indexes
        console.log('🔧 Creating database indexes...');
        await db.collection('services').createIndex({ title: 'text', description: 'text', category: 'text', company: 'text' });
        await db.collection('services').createIndex({ userEmail: 1 });
        await db.collection('reviews').createIndex({ serviceId: 1 });
        await db.collection('reviews').createIndex({ userEmail: 1 });

        console.log('✅ Database indexes created successfully');
        console.log('');

        return db;
    } catch (error) {
        console.log('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ MongoDB Connection Failed!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Error:', error.message);
        console.error('');
        console.error('💡 Possible Solutions:');
        console.error('   1. Check your MongoDB connection string');
        console.error('   2. Ensure your IP is whitelisted in MongoDB Atlas');
        console.error('   3. Verify your database credentials are correct');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
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
