const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please provide a room number'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide a room type'],
    enum: {
      values: ['Single', 'Deluxe', 'Suite', 'Presidential'],
      message: '{VALUE} is not a valid room type'
    }
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    immutable: true
  },
  amenities: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide room capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [10, 'Capacity cannot exceed 10'],
    default: 2
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    required: [true, 'Please provide a room status'],
    enum: {
      values: ['Available', 'Booked', 'Maintenance'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Available'
  }
}, {
  timestamps: true
});

// Virtual for formatted price in INR
roomSchema.virtual('priceINR').get(function() {
  if (this.price === undefined || this.price === null) return '₹0';
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Include virtuals in JSON
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Room', roomSchema);
