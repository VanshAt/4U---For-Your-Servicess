const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  icon: {
    type: String, // String representation of the Lucide icon, like "Fan", "Settings"
    required: true,
  },
  delay: {
    type: Number, // For staggered UI animations
    default: 100,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
