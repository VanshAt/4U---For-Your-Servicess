const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
