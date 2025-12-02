import express from 'express';
import { getDB } from '../config/db.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { ObjectId } from 'mongodb';
import Fuse from 'fuse.js';

const router = express.Router();

// Get all services with search and filter
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        const db = getDB();
        const servicesCollection = db.collection('services');

        let pipeline = [];

        // 1. Match stage (Filter by category)
        if (category && category !== 'all') {
            pipeline.push({
                $match: { category: category }
            });
        }

        // 2. Convert _id to string for lookup matching
        pipeline.push({
            $addFields: {
                serviceIdString: { $toString: '$_id' }
            }
        });

        // 3. Lookup reviews to calculate rating and count
        pipeline.push({
            $lookup: {
                from: 'reviews',
                localField: 'serviceIdString',
                foreignField: 'serviceId',
                as: 'reviews'
            }
        });

        // 3. Add fields for average rating and review count
        pipeline.push({
            $addFields: {
                reviewCount: { $size: '$reviews' },
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: '$reviews' }, 0] },
                        then: { $avg: '$reviews.rating' },
                        else: 0
                    }
                }
            }
        });

        // 4. Project to remove the heavy reviews array but keep the stats
        pipeline.push({
            $project: {
                reviews: 0
            }
        });

        // Execute aggregation
        let services = await servicesCollection.aggregate(pipeline).toArray();

        // Fuzzy search if search query exists (done in memory for now as Fuse.js is better for this than simple regex)
        if (search) {
            const fuse = new Fuse(services, {
                keys: ['title', 'company', 'category', 'description'],
                threshold: 0.3,
                includeScore: true
            });

            const result = fuse.search(search);
            services = result.map(res => res.item);
        }

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// Get featured services (6 random services)
router.get('/featured', async (req, res) => {
    try {
        const db = getDB();
        const servicesCollection = db.collection('services');

        const services = await servicesCollection.aggregate([
            { $sample: { size: 6 } }
        ]).toArray();

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured services', error: error.message });
    }
});

// Get single service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const servicesCollection = db.collection('services');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid service ID' });
        }

        const service = await servicesCollection.findOne({ _id: new ObjectId(id) });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service', error: error.message });
    }
});

// Get services by user email
router.get('/user/:email', verifyToken, async (req, res) => {
    try {
        const { email } = req.params;

        // Verify that the requester is accessing their own data
        if (req.user.email !== email) {
            return res.status(403).json({ message: 'Forbidden: Cannot access other users data' });
        }

        const db = getDB();
        const servicesCollection = db.collection('services');

        const services = await servicesCollection.find({ userEmail: email }).toArray();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user services', error: error.message });
    }
});

// Create new service (Protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const serviceData = req.body;
        const db = getDB();
        const servicesCollection = db.collection('services');

        // Validate required fields
        const requiredFields = ['title', 'company', 'description', 'category', 'price', 'imageUrl', 'userEmail'];
        const missingFields = requiredFields.filter(field => !serviceData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Add timestamp
        const newService = {
            ...serviceData,
            addedDate: new Date(),
            createdAt: new Date()
        };

        const result = await servicesCollection.insertOne(newService);
        res.status(201).json({ success: true, serviceId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating service', error: error.message });
    }
});

// Update service (Protected)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const db = getDB();
        const servicesCollection = db.collection('services');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid service ID' });
        }

        // Check if service exists and belongs to user
        const service = await servicesCollection.findOne({ _id: new ObjectId(id) });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: Cannot update other users services' });
        }

        // Update service
        const { _id, userEmail, addedDate, createdAt, ...allowedUpdates } = updateData;
        const result = await servicesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...allowedUpdates, updatedAt: new Date() } }
        );

        res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error updating service', error: error.message });
    }
});

// Delete service (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const servicesCollection = db.collection('services');

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid service ID' });
        }

        // Check if service exists and belongs to user
        const service = await servicesCollection.findOne({ _id: new ObjectId(id) });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: Cannot delete other users services' });
        }

        // Delete service
        const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });

        // Also delete associated reviews
        await db.collection('reviews').deleteMany({ serviceId: id });

        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error: error.message });
    }
});

export default router;
