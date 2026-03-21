const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Technician = require('./models/Technician');

const seedTechnicians = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/home-services');
    console.log('MongoDB Connected for Seeding...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('tech123', salt);

    const fakeTechs = [
      {
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul@tech.com',
        password: password,
        service_type: ['ac-repair', 'plumbing'],
        location: { type: 'Point', coordinates: [77.1025, 28.7041] }, // Delhi
        rating: 4.5,
        total_jobs: 12
      },
      {
        name: 'Amit Kumar',
        phone: '8765432109',
        email: 'amit@tech.com',
        password: password,
        service_type: ['electrician', 'refrigerator-repair'],
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }, // Delhi Central
        rating: 4.8,
        total_jobs: 25
      }
    ];

    for (const tech of fakeTechs) {
      const exists = await Technician.findOne({ email: tech.email });
      if (!exists) {
        await Technician.create(tech);
        console.log(`Created technician: ${tech.name}`);
      } else {
        console.log(`Technician ${tech.name} already exists.`);
      }
    }

    console.log('Seeding completed!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedTechnicians();
