import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import reviewsRoutes from './routes/reviews.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Service Review API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to database and start server
connectDB().then(() => {
    const startServer = (port) => {
        const server = app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
            console.log(`📡 API URL: http://localhost:${port}`);
            console.log('');
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️  Port ${port} is busy, trying port ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('❌ Server error:', err);
                process.exit(1);
            }
        });
    };

    startServer(PORT);
});
