const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  location: {
    type: { type: String },
    coordinates: [Number], // [longitude, latitude]
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
