# Rudraksh Inn - Backend

Node.js + Express REST API for the Rudraksh Inn booking system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start
```

## 📁 Folder Structure

```
backend/
├── config/          # Configuration files (database, etc.)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── controllers/     # Route handler logic
├── middleware/      # Custom middleware (auth, error handling)
├── utils/           # Utility functions
└── server.js        # Main application entry point
```

## 🔧 Environment Variables

Create a `.env` file (see `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rudraksh-inn
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Optional
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** (dev) - Auto-restart server

## 🗄️ Database

This project uses MongoDB. Make sure MongoDB is running:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

## 🔐 API Routes

All routes will be prefixed with `/api`:

- `/api/auth` - Authentication
- `/api/rooms` - Room management
- `/api/bookings` - Booking management
- `/api/restaurant` - Restaurant operations
- `/api/room-service` - Room service orders
- `/api/analytics` - Analytics and reports

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
