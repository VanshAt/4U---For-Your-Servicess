const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with frontend URL (e.g., http://localhost:5173)
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Customer or Admin joins a room using the booking ID to track live updates
  socket.on('joinBookingRoom', (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`Socket ${socket.id} joined room booking_${bookingId}`);
  });

  // Technician sends location updates here
  socket.on('technicianLocationUpdate', (data) => {
    // data should contain { bookingId, location: { lat, lng } }
    io.to(`booking_${data.bookingId}`).emit('locationUpdated', data.location);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/technicians', require('./routes/technicianRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
