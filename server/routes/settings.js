const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Get current Gym settings
router.get('/', async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Gym setting not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Gym location
router.post('/location', async (req, res) => {
  const { location } = req.body;
  try {
    let admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Gym setting not found' });
    
    admin.location = location;
    await admin.save();
    
    res.json({ message: 'Location updated successfully', admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
