const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const Admin = require('../models/Admin');

// Mark attendance via QR string
router.post('/scan', async (req, res) => {
  const { qrCodeString } = req.body;
  try {
    const member = await Member.findOne({ qrCodeString });
    if (!member) {
      return res.status(404).json({ message: 'Member not found or invalid QR' });
    }

    if (member.status === 'Expired') {
      return res.status(403).json({ 
        message: 'Membership expired', 
        member: { name: member.name, photo: member.memberPhoto } 
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ memberId: member._id, date: today });
    
    if (existing) {
      return res.status(200).json({ 
        message: 'Already checked in today', 
        member: { name: member.name, photo: member.memberPhoto } 
      });
    }

    const attendance = new Attendance({
      memberId: member._id,
      date: today
    });

    await attendance.save();
    res.status(201).json({ 
      message: 'Attendance marked successfully', 
      member: { name: member.name, photo: member.memberPhoto } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mobile Wall-QR Check-in (Device Bound)
router.post('/checkin-qr', async (req, res) => {
  const { gymId, identifier, deviceInfo, deviceId } = req.body;
  
  if (!gymId || !identifier) {
    return res.status(400).json({ message: 'Gym ID and identifier (phone/ID) are required' });
  }

  try {
    const admin = await Admin.findById(gymId);
    if (!admin) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Lookup member by phone or qrCodeString
    const member = await Member.findOne({ 
      $or: [
        { phone: identifier },
        { qrCodeString: identifier }
      ]
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.status === 'Expired') {
      return res.status(403).json({ 
        message: 'Membership expired', 
        member: { name: member.name, photo: member.memberPhoto, expiryDate: member.expiryDate } 
      });
    }

    // Device Fingerprinting Check
    if (deviceId) {
      if (!member.deviceId) {
        member.deviceId = deviceId;
        await member.save();
      } else if (member.deviceId !== deviceId) {
        return res.status(403).json({
          message: 'DeviceMismatched',
          member: { name: member.name, photo: member.memberPhoto, expiryDate: member.expiryDate }
        });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ memberId: member._id, date: today });
    
    if (existing) {
      return res.status(200).json({ 
        message: 'Already checked in today', 
        member: { name: member.name, photo: member.memberPhoto, expiryDate: member.expiryDate } 
      });
    }

    const attendance = new Attendance({
      memberId: member._id,
      date: today,
      deviceInfo
    });

    await attendance.save();

    // Emit Real-time Admin Alert
    if (req.io) {
      const payload = {
        gymId,
        message: `${member.name} just checked in!`,
        member: {
          name: member.name,
          photo: member.memberPhoto,
          time: new Date()
        }
      };
      req.io.emit(`checkinAlert-${gymId}`, payload); // Specific room
      req.io.emit(`checkinAlert`, payload); // Global room fallback
    }
    // end of emit block

    res.status(201).json({ 
      message: 'Check-in successful', 
      member: { name: member.name, photo: member.memberPhoto, expiryDate: member.expiryDate } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get today's attendance
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: today })
      .populate('memberId', 'name phone status memberPhoto qrCodeString')
      .sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance history by date
router.get('/history', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required' });
  try {
    const records = await Attendance.find({ date })
      .populate('memberId', 'name phone status memberPhoto qrCodeString')
      .sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get retention (members not visited in last 10 days)
router.get('/retention', async (req, res) => {
  try {
    const tenDaysAgoDate = new Date();
    tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 10);
    
    const recentAttendances = await Attendance.find({ 
      timestamp: { $gte: tenDaysAgoDate } 
    }).distinct('memberId');

    const inactiveMembers = await Member.find({
      _id: { $nin: recentAttendances },
      status: 'Active'
    }).select('name phone memberPhoto status qrCodeString');

    res.json(inactiveMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
