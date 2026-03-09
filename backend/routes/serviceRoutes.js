const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/services/seed
// @desc    Seed initial services into the database
// @access  Public (for dev/setup)
router.post('/seed', async (req, res) => {
  try {
    // Check if services already exist
    const count = await Service.countDocuments();
    if (count > 0) {
      return res.status(400).json({ msg: 'Services already seeded. Clear collection first to re-seed.' });
    }

    const servicesList = [
      { icon: "Fan", title: "AC Repair & Service", description: "AC servicing, repair, and gas refilling.", price: 499, delay: 100 },
      { icon: "Settings", title: "Washing Machine", description: "Fixing drum issues and motor problems.", price: 399, delay: 200 },
      { icon: "ThermometerSnowflake", title: "Refrigerator Repair", description: "Cooling issues and gas charging.", price: 449, delay: 300 },
      { icon: "Settings", title: "Oven Repair", description: "Heating issues and general servicing.", price: 299, delay: 400 },
      { icon: "Waves", title: "Water Purifier", description: "Filter replacement and cleaning.", price: 349, delay: 100 },
      { icon: "Droplets", title: "Plumbing", description: "Leakages, blockages, and fittings.", price: 199, delay: 200 },
      { icon: "Zap", title: "Electrician", description: "Wiring fixes and appliance setup.", price: 199, delay: 300 },
    ];

    const services = await Service.insertMany(servicesList);
    res.json({ msg: 'Services seeded successfully', count: services.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
