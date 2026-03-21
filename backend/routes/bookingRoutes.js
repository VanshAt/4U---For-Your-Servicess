const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Technician = require('../models/Technician');
const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

const sendWhatsAppConfirmation = async (phone, bookingId) => {
  if (!twilioClient || !twilioWhatsappFrom) return false;
  
  try {
    let toPhone = phone;
    // Format phone number for WhatsApp
    if (toPhone.startsWith('+')) {
      toPhone = `whatsapp:${toPhone}`;
    } else if (toPhone.startsWith('91') && toPhone.length >= 10) {
      toPhone = `whatsapp:+${toPhone}`;
    } else {
      toPhone = `whatsapp:+91${toPhone}`; // Assume India
    }

    const msg1 = "✅ Your service is booked via 4U.\nFor safety & 7-day guarantee, please communicate only through this number.";
    const msg2 = `📋 Your service (Job ID: ${bookingId}) is recorded. If any issue arises, reply here.`;

    await twilioClient.messages.create({
      body: msg1,
      from: twilioWhatsappFrom,
      to: toPhone
    });

    await twilioClient.messages.create({
      body: msg2,
      from: twilioWhatsappFrom,
      to: toPhone
    });
    
    return true;
  } catch (err) {
    console.error("Twilio send error:", err);
    return false;
  }
};

const authMiddleware = require('../middleware/authMiddleware');
const Service = require('../models/Service');

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceType, address, timeSlot, problemDescription } = req.body;
    const customerId = req.user.id; // From authMiddleware

    // 1. Get service title from ID
    const serviceDoc = await Service.findById(serviceType);
    const serviceReadable = serviceDoc ? serviceDoc.title : 'General Service';

    // 2. Simple assignment logic
    const technician = await Technician.findOne({ 
      service_type: serviceReadable, // Match by title now for flexibility
      availability: true 
    });

    // 3. Create Booking
    const bookingData = {
      customer: customerId,
      service_type: serviceReadable,
      address,
      time_slot: timeSlot,
      problem_description: problemDescription,
      status: technician ? 'Assigned' : 'Pending'
    };
    
    if (technician) {
      bookingData.technician = technician._id;
    }

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      data: booking,
      message: technician ? 'Technician assigned successfully' : 'Booking created, waiting for technician'
    });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get bookings for logged-in customer
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id }).populate('technician').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get all bookings (Admin/Dashboard)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer').populate('technician');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer').populate('technician');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
