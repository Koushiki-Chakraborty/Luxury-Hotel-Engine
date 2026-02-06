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
  originalPrice: {
    type: Number,
    required: [true, 'Please provide an original price'],
    min: [0, 'Original price cannot be negative']
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

// Validation: price must be <= originalPrice
roomSchema.pre('save', function() {
  if (this.price > this.originalPrice) {
    throw new Error('Price cannot be greater than original price');
  }
});

// Also validate on update
roomSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  
  // Handle both direct update and $set operator
  const price = update.price || update.$set?.price;
  const originalPrice = update.originalPrice || update.$set?.originalPrice;
  
  // If both are being updated, validate
  if (price !== undefined && originalPrice !== undefined) {
    if (price > originalPrice) {
      throw new Error('Price cannot be greater than original price');
    }
  }
});

// Virtual for discount percentage
roomSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > 0 && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for formatted price in INR
roomSchema.virtual('priceINR').get(function() {
  if (this.price === undefined || this.price === null) return '₹0';
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Virtual for formatted original price in INR
roomSchema.virtual('originalPriceINR').get(function() {
  if (this.originalPrice === undefined || this.originalPrice === null) return '₹0';
  return `₹${this.originalPrice.toLocaleString('en-IN')}`;
});

// Include virtuals in JSON
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Room', roomSchema);
