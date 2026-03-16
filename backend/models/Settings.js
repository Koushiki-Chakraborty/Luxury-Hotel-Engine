const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  defaultCheckoutTime: {
    type: String,
    required: true,
    default: '11:00'
  },
  defaultCheckInTime: {
    type: String,
    required: true,
    default: '12:00'
  },
  hotelContactNumber: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
