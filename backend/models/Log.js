const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: {
      values: ['MMT', 'Goibibo', 'Booking.com', 'Call', 'Walk-in', 'WhatsApp', 'Event'],
      message: '{VALUE} is not a valid source'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Room', 'Restaurant', 'Party/Event'],
      message: '{VALUE} is not a valid category'
    }
  },
  roomNumber: {
    type: String,
    required: function () { return this.category === 'Room'; },
    validate: {
      validator: function (v) {
        if (this.category !== 'Room') return true;
        return v && v.trim().length > 0;
      },
      message: 'Room number is required for Room category'
    }
  },
  customerName: {
    type: String,
    required: function () { return this.category === 'Room'; },
    trim: true,
    minlength: [2, 'Customer name must be at least 2 characters long'],
    validate: {
      validator: function (v) {
        if (this.category !== 'Room') return true;
        return v && v.trim().length >= 2;
      },
      message: 'Customer name is required for Room category'
    }
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: function () {
      return this.category === 'Room' || this.category === 'Party/Event';
    },
    validate: {
      validator: function (v) {
        // Not required for Restaurant
        if (this.category === 'Restaurant') return true;

        // Required for Room and Party/Event
        if (!v) return false;

        // Must be exactly 10 digits
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  checkoutDate: {
    type: Date
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Active'
  },
  startTime: {
    type: String, // e.g., "14:00"
    required: function () { return this.category === 'Party/Event'; },
    validate: {
      validator: function (v) {
        if (this.category !== 'Party/Event') return true;
        // Validate HH:MM format
        return v && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time is required for Party/Event in HH:MM format'
    }
  },
  endTime: {
    type: String, // e.g., "18:00"
    required: function () { return this.category === 'Party/Event'; },
    validate: {
      validator: function (v) {
        if (this.category !== 'Party/Event') return true;
        // Validate HH:MM format
        return v && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time is required for Party/Event in HH:MM format'
    }
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
    default: 0,
    min: [0, 'Total amount cannot be negative']
  }
}, {
  timestamps: true
});

// Pre-save hook to auto-calculate totalAmount
logSchema.pre('save', function () {
  this.totalAmount = this.units * this.duration * this.unitPrice;
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
