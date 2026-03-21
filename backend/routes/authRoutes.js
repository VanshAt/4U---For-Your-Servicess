const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Customer = require('../models/Customer');
const Technician = require('../models/Technician');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// @route   POST /api/auth/register/customer
// @desc    Register a new customer
router.post('/register/customer', async (req, res) => {
  try {
    const { name, email, phone, password, address, location } = req.body;
    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).json({ message: 'Customer already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    customer = new Customer({
      name, email, phone, password: hashedPassword, address, location
    });

    await customer.save();
    
    const token = jwt.sign({ id: customer._id, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: customer._id, name, email, role: 'customer' } });
  } catch (error) {
    console.error('Registration Error (Customer):', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/auth/register/technician
// @desc    Register a new technician
router.post('/register/technician', async (req, res) => {
  try {
    const { name, email, phone, password, service_type } = req.body;
    let technician = await Technician.findOne({ email });
    if (technician) return res.status(400).json({ message: 'Technician already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    technician = new Technician({
      name, email, phone, password: hashedPassword, service_type
    });

    await technician.save();
    
    const token = jwt.sign({ id: technician._id, role: 'technician' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: technician._id, name, email, role: 'technician' } });
  } catch (error) {
    console.error('Registration Error (Technician):', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login for customer, technician, or admin
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body; // role: 'customer' | 'technician' | 'admin'

    let user;
    if (role === 'customer') {
      user = await Customer.findOne({ email });
    } else if (role === 'technician') {
      user = await Technician.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
      // Temporary: If admin doesn't exist and they try to login with a specific setup email, create it
      if (!user && email === 'admin@homeservices.com') {
         const salt = await bcrypt.genSalt(10);
         const hashed = await bcrypt.hash('admin123', salt);
         user = new Admin({ email: 'admin@homeservices.com', password: hashed });
         await user.save();
      }
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name || 'Admin', role } });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
