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

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, serviceType, timeSlot, problemDescription } = req.body;

    // 1. Find or create customer
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ name, phone, address });
    }

    // 2. Simple assignment logic (find first available tech for this service)
    // In a real app, this would use geospatial `$near` queries.
    const technician = await Technician.findOne({ 
      service_type: serviceType, 
      availability: true 
    });

    // 3. Create Booking
    const bookingData = {
      customer: customer._id,
      service_type: serviceType,
      address,
      time_slot: timeSlot,
      problem_description: problemDescription,
      status: technician ? 'Assigned' : 'Pending'
    };
    
    // Only set technician if one was found to avoid Mongoose CastErrors with null/undefined for ObjectId
    if (technician) {
      bookingData.technician = technician._id;
    }

    const booking = await Booking.create(bookingData);

    // 4. Send WhatsApp Confirmation
    let twilioSent = false;
    if (phone) {
      twilioSent = await sendWhatsAppConfirmation(phone, booking._id);
    }

    res.status(201).json({
      success: true,
      data: booking,
      twilioSent,
      message: technician ? 'Technician assigned successfully' : 'Booking created, waiting for technician'
    });
  } catch (error) {
    console.error(error);
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

module.exports = router;
