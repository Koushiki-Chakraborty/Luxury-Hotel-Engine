const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables (touched to force restart)
dotenv.config();

// Security check
const requiredEnv = ['JWT_SECRET', 'MONGO_URI'];

requiredEnv.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`${key} not set in environment variables`);
  }
});

// Initialize Express app
const app = express();

const helmet = require('helmet');
app.use(helmet());

// Connect to MongoDB
connectDB();

const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Rudraksh Inn API' });
});

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const roomRoutes = require('./routes/roomRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const logRoutes = require('./routes/logRoutes');

// Admin routes
app.use('/api/admin', adminRoutes);

// Room routes
app.use('/api/rooms', roomRoutes);

// Restaurant routes
app.use('/api/restaurant', restaurantRoutes);

// Log routes (Digital Logbook)
app.use('/api/logs', logRoutes);

// Settings routes
app.use('/api/settings', require('./routes/settingsRoutes'));

// Other routes (will be created later)
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/bookings', require('./routes/booking.routes'));
// app.use('/api/restaurant', require('./routes/restaurant.routes'));
// app.use('/api/room-service', require('./routes/roomService.routes'));
// app.use('/api/analytics', require('./routes/analytics.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
