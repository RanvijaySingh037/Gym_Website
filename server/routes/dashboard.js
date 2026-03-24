const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Expense = require('../models/Expense');
const Attendance = require('../models/Attendance');

router.get('/', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    
    // Revenue mock calculation: sum of active members plan cost
    // Monthly=1500, Quarterly=4000, Annual=12000
    const activeMembers = await Member.find({ status: { $ne: 'Expired' } });
    let revenue = 0;
    activeMembers.forEach(m => {
      if(m.planType === 'Monthly') revenue += 1500;
      else if(m.planType === 'Quarterly') revenue += 4000;
      else if(m.planType === 'Annual') revenue += 12000;
      else revenue += 1500; // fallback
    });

    let revenueStr = revenue >= 100000 ? `₹${(revenue/100000).toFixed(1)}L` : `₹${revenue}`;

    const today = new Date().toISOString().split('T')[0];
    const todaysAttendance = await Attendance.countDocuments({ date: today });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const expiringMembers = await Member.find({
      status: { $ne: 'Expired' },
      expiryDate: { $lte: nextWeek }
    }).sort({ expiryDate: 1 });

    const recentCheckins = await Attendance.find({ date: today })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('memberId', 'name memberPhoto');

    res.json({
      totalMembers,
      revenueStr,
      revenue,
      todaysAttendance,
      expiringSoonCount: expiringMembers.length,
      expiryAlerts: expiringMembers.slice(0, 5).map(m => ({
        id: m._id,
        name: m.name,
        expiryDate: m.expiryDate
      })),
      recentCheckins: recentCheckins.map(c => ({
        id: c._id,
        member: c.memberId ? c.memberId.name : 'Unknown',
        photo: c.memberId ? c.memberId.memberPhoto : null,
        time: new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }))
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

module.exports = router;
