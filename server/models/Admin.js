const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gymName: { type: String, required: true },
  brandingLogo: { type: String }, // URL or Base64
  location: { 
    lat: { type: Number },
    lng: { type: Number }
  },
  radius: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
