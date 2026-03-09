const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Home Services API is running');
});

// Import Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/technicians', require('./routes/technicianRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
