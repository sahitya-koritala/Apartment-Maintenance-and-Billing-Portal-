const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Flat = require('./models/Flat');
const Bill = require('./models/Bill');
const Payment = require('./models/Payment');
const Notice = require('./models/Notice');
const Complaint = require('./models/Complaint');
require('dotenv').config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apartment-management');
    console.log('Connected to DB for seeding...');

    // Clear existing
    await User.deleteMany();
    await Flat.deleteMany();
    await Bill.deleteMany();
    await Payment.deleteMany();
    await Notice.deleteMany();
    await Complaint.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@apartment.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create Flats
    const flat1 = await Flat.create({ flatNumber: '101', block: 'A', floor: 1 });
    const flat2 = await Flat.create({ flatNumber: '102', block: 'A', floor: 1 });
    const flat3 = await Flat.create({ flatNumber: '201', block: 'B', floor: 2 });

    // Create Residents
    const res1 = await User.create({ name: 'John Doe', email: 'john@resident.com', password: hashedPassword, role: 'resident', flatId: flat1._id });
    const res2 = await User.create({ name: 'Jane Smith', email: 'jane@resident.com', password: hashedPassword, role: 'resident', flatId: flat2._id });

    // Assign owner
    flat1.ownerId = res1._id; await flat1.save();
    flat2.ownerId = res2._id; await flat2.save();

    // Create Bills
    const bill1 = await Bill.create({ flatId: flat1._id, month: 'March 2026', maintenance: 1500, water: 200, electricity: 500, totalAmount: 2200, status: 'paid' });
    const bill2 = await Bill.create({ flatId: flat2._id, month: 'March 2026', maintenance: 1500, water: 250, electricity: 600, totalAmount: 2350, status: 'unpaid' });
    const bill3 = await Bill.create({ flatId: flat1._id, month: 'April 2026', maintenance: 1500, water: 200, electricity: 550, totalAmount: 2250, status: 'unpaid' });

    // Create Payments
    await Payment.create({ billId: bill1._id, amount: 2200, paymentMode: 'UPI' });

    // Create Notices
    await Notice.create({ title: 'Water Supply Disturbance', description: 'Water supply will be stopped on April 15th for 2 hours due to pipe repair.', date: new Date() });
    await Notice.create({ title: 'Annual Meeting', description: 'All residents are mandated to join the annual meeting in the clubhouse.', date: new Date() });

    console.log('Seeding Complete! Try logging in with: admin@apartment.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDB();
