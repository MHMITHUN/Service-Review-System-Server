import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

// Get platform statistics
router.get('/', async (req, res) => {
    try {
        const db = getDB();

        const [serviceCount, reviewCount] = await Promise.all([
            db.collection('services').countDocuments(),
            db.collection('reviews').countDocuments()
        ]);

        // Get unique users from services and reviews
        const serviceUsers = await db.collection('services').distinct('userEmail');
        const reviewUsers = await db.collection('reviews').distinct('userEmail');
        const uniqueUsers = new Set([...serviceUsers, ...reviewUsers]);

        res.json({
            users: uniqueUsers.size,
            services: serviceCount,
            reviews: reviewCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

export default router;
