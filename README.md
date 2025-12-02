# Service Review System - Server

RESTful API server for the Service Review platform, built with Node.js, Express, and MongoDB.

## 🌐 Live URL
[Server API](https://your-vercel-url.vercel.app)

## 📋 Purpose
Backend API that powers the Service Review platform, handling authentication, service management, reviews, and statistics with JWT-based security.

## ✨ Key Features

### Authentication & Security
- **JWT Token Generation** with secure HTTP-only cookies
- **Protected API Routes** with token verification middleware
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for secure credential storage

### Service Management
- **CRUD Operations** for services
- **Server-side Search** using MongoDB text indexes
- **Category Filtering** for refined results
- **User-specific Queries** to fetch user's services
- **Random Featured Services** using MongoDB aggregation

### Review System
- **CRUD Operations** for reviews
- **Service-specific Reviews** retrieval
- **User-specific Reviews** management
- **Automatic Timestamp** generation

### Statistics
- **Platform Analytics** - count of users, services, and reviews
- **Unique User Counting** from multiple collections

## 📦 NPM Packages Used

### Core Dependencies
- `express` - Web framework
- `mongodb` - MongoDB native driver
- `jsonwebtoken` - JWT token generation/verification
- `cookie-parser` - Cookie parsing middleware
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 🗂️ Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── verifyToken.js     # JWT verification
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── services.js        # Service CRUD routes
│   ├── reviews.js         # Review CRUD routes
│   └── stats.js           # Statistics routes
├── index.js               # Main server file
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/login` - Generate JWT token
- `POST /api/auth/logout` - Clear JWT cookie

### Services
- `GET /api/services` - Get all services (supports search & filter)
- `GET /api/services/featured` - Get 6 random services
- `GET /api/services/:id` - Get single service
- `GET /api/services/user/:email` - Get user's services (Protected)
- `POST /api/services` - Create service (Protected)
- `PATCH /api/services/:id` - Update service (Protected)
- `DELETE /api/services/:id` - Delete service (Protected)

### Reviews
- `GET /api/reviews/service/:serviceId` - Get reviews for a service
- `GET /api/reviews/user/:email` - Get user's reviews (Protected)
- `POST /api/reviews` - Create review (Protected)
- `PATCH /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### Statistics
- `GET /api/stats` - Get platform statistics

## 🔒 Security Features

- JWT tokens stored in HTTP-only cookies
- CORS configuration for specific origins
- Environment variables for sensitive data
- Token expiration (7 days)
- User-specific data access control

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Production Configuration
- Set `NODE_ENV=production`
- Update `CLIENT_URL` to production URL
- Enable secure cookies with `sameSite: 'none'`

## 📊 Database Schema

### Services Collection
```javascript
{
  title: String,
  company: String,
  website: String,
  description: String,
  category: String,
  price: Number,
  imageUrl: String,
  userEmail: String,
  addedDate: Date,
  createdAt: Date
}
```

### Reviews Collection
```javascript
{
  serviceId: String,
  serviceTitle: String,
  rating: Number,
  reviewText: String,
  userEmail: String,
  userName: String,
  userPhoto: String,
  postedDate: String,
  createdAt: Date
}
```

## 👨‍💻 Developer
Created with ❤️ for PH Assignment 11

## 📄 License
MIT License
