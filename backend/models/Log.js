const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  source: {
    type: String,
    required: true,
    enum: ['MMT', 'Goibibo', 'Booking.com', 'Call', 'Walk-in', 'WhatsApp', 'Event']
  },
  category: {
    type: String,
    required: true,
    enum: ['Room', 'Restaurant', 'Party/Event']
  },
  roomNumber: {
    type: String,
    required: function() { return this.category === 'Room'; }
  },
  customerName: {
    type: String,
    required: function() { return this.category === 'Room'; },
    trim: true
  },
  checkoutDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  // Kept for backward compatibility or general notes if needed, but not primary
  description: {
    type: String,
    trim: true
  },
  units: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  duration: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save hook to auto-calculate totalAmount
logSchema.pre('save', function() {
  this.totalAmount = this.units * this.duration * this.unitPrice;
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
