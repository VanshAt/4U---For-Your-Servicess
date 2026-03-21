const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// Get all technicians (for admin or testing)
router.get('/', async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.status(200).json({ success: true, data: technicians });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create a technician (for seeding database)
router.post('/', async (req, res) => {
  try {
    const technician = await Technician.create(req.body);
    res.status(201).json({ success: true, data: technician });
  } catch (error) {
    console.error('Technician Creation Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET /api/technicians/:id/jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const jobs = await Booking.find({ technician: req.params.id })
      .populate('customer')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
