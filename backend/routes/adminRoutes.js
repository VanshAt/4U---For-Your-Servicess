const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email phone address')
      .populate('technician', 'name phone service_type')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/bookings/:id/assign
router.put('/bookings/:id/assign', async (req, res) => {
  try {
    const { technicianId } = req.body;
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.technician = technicianId;
    booking.status = 'Assigned';
    await booking.save();

    booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name phone service_type');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
