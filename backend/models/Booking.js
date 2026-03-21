const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  service_type: { type: String, required: true },
  address: { type: String, required: true },
  time_slot: { type: String, required: true },
  problem_description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
