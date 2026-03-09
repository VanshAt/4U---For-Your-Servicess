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
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
