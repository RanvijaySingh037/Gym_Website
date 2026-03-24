const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gymos')
  .then(async () => {
    console.log('Connected to DB');
    const admin = await Admin.findOne();
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new Admin({
        email: 'admin@gymos.com',
        password: hashedPassword,
        gymName: 'GymOS Elite Patna'
      });
      await newAdmin.save();
      console.log('Successfully created a dummy Admin record:', newAdmin._id);
    } else {
      console.log('Admin record already exists:', admin._id);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
