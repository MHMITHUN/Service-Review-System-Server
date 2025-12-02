import express from 'express';
import { getDB } from '../config/db.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get recent reviews for home page
router.get('/recent', async (req, res) => {
    try {
        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        // Fetch last 3 reviews, sorted by creation date
        const reviews = await reviewsCollection.find({})
            .sort({ createdAt: -1 })
            .limit(3)
            .toArray();

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent reviews', error: error.message });
    }
});

// Get reviews for a specific service
router.get('/service/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection.find({ serviceId }).sort({ createdAt: -1 }).toArray();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

// Get reviews by user email (Private)
router.get('/user/:email', verifyToken, async (req, res) => {
    try {
        const { email } = req.params;

        // Verify that the requester is accessing their own data
        if (req.user.email !== email) {
            return res.status(403).json({ message: 'Forbidden: Cannot access other users data' });
        }

        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection.find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
    }
});

// Create new review (Protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const reviewData = req.body;
        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        // Validate required fields
        const requiredFields = ['serviceId', 'serviceTitle', 'rating', 'reviewText', 'userEmail', 'userName', 'userPhoto'];
        const missingFields = requiredFields.filter(field => !reviewData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Add timestamp
        const newReview = {
            ...reviewData,
            createdAt: new Date(),
            postedDate: new Date().toISOString()
        };

        const result = await reviewsCollection.insertOne(newReview);
        res.status(201).json({ success: true, reviewId: result.insertedId, review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
});

// Update review (Protected)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        // Check if review exists and belongs to user
        const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: Cannot update other users reviews' });
        }

        // Update only allowed fields (not serviceTitle, userEmail, etc.)
        const { rating, reviewText } = updateData;
        const result = await reviewsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { rating, reviewText, updatedAt: new Date() } }
        );

        res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
});

// Delete review (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const reviewsCollection = db.collection('reviews');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        // Check if review exists and belongs to user
        const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: Cannot delete other users reviews' });
        }

        // Delete review
        const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

export default router;
