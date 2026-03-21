const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  service_type: { type: [String], required: true }, // e.g., ['ac-repair', 'plumbing']
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // Default to [0,0] if not provided
  },
  rating: { type: Number, default: 0 },
  total_jobs: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

technicianSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Technician', technicianSchema);
