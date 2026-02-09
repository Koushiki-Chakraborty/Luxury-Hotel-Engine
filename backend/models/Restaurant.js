const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
