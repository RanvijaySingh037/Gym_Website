const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  planType: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annual'],
    required: true
  },
  joinDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  memberPhoto: { type: String }, // URL or Base64
  qrCodeString: { type: String, unique: true },
  deviceId: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Pending'], 
    default: 'Active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
