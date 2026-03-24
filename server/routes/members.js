const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function numberToWords(num) {
  if (!num) return '';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  if (num === 0) return 'Zero Rupees Only';
  function convert(n) {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return n.toString();
  }
  return convert(num) + ' Rupees Only';
}

let mockMembers = []; // Fallback memory store

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.warn("DB find failed, using mock data for members");
    res.json(mockMembers);
  }
});

// Create a member
router.post('/', async (req, res) => {
  const { name, phone, planType, joinDate, memberPhoto } = req.body;
  
  // Expiry logic
  let duration = 1; // months
  if (planType === 'Quarterly') duration = 3;
  if (planType === 'Annual') duration = 12;

  const expiryDate = new Date(joinDate || Date.now());
  expiryDate.setMonth(expiryDate.getMonth() + duration);

  const member = new Member({
    name,
    phone,
    planType,
    joinDate: joinDate || Date.now(),
    expiryDate,
    memberPhoto,
    qrCodeString: `GYM-${phone}-${Date.now()}`
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.warn("DB save failed, using mock data for members");
    const newMockMember = {
      _id: Date.now().toString(),
      name,
      phone,
      planType,
      joinDate: joinDate || Date.now(),
      expiryDate,
      memberPhoto,
      qrCodeString: `GYM-${phone}-${Date.now()}`,
      status: 'Active'
    };
    mockMembers.push(newMockMember);
    res.status(201).json(newMockMember);
  }
});

// Update a member
router.put('/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset Device Binding
router.put('/:id/reset-device', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    member.deviceId = null;
    await member.save();
    res.json({ message: 'Device reset successfully', member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process Payment and Generate Receipt
router.post('/:id/payment', async (req, res) => {
  const amount = Number(req.body.amount || 0);
  const { paymentMethod, planType } = req.body;
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Update Expiry Date based on plan (smart renewal logic)
    const renewedPlan = planType || member.planType;
    let duration = 1; // months
    if (renewedPlan === 'Quarterly') duration = 3;
    if (renewedPlan === 'Annual') duration = 12;

    const currentExpiry = new Date(member.expiryDate);
    const today = new Date();
    
    // Add new duration on top of current expiry if not yet expired
    let baseDate = currentExpiry > today ? currentExpiry : today;
    
    const newExpiry = new Date(baseDate);
    newExpiry.setMonth(newExpiry.getMonth() + duration);
    
    member.planType = renewedPlan;
    member.expiryDate = newExpiry;
    member.status = 'Active';
    await member.save();

    // Generate PDF
    const transactionId = `TXN-${Date.now()}`;
    const receiptFilename = `receipt_${member._id}_${Date.now()}.pdf`;
    const receiptPath = path.join(__dirname, '..', 'public', 'receipts', receiptFilename);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(receiptPath));

    // Fake Logo Background Box
    doc.rect(50, 45, 120, 35).fill('#E11D48');
    // Logo Text
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#FFFFFF').text('GYMOS PRO', 60, 55);

    // Header Title
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('PAYMENT RECEIPT', 200, 55, { align: 'right' });
    doc.fontSize(10).font('Helvetica').fillColor('#666666').text('Official Digital Copy', 200, 75, { align: 'right' });
    doc.moveDown(3);

    // Line separator
    doc.moveTo(50, 100).lineTo(550, 100).lineWidth(1).strokeColor('#E5E7EB').stroke();
    doc.moveDown(2);

    // Watermark
    doc.fontSize(80).fillColor('#10B981').opacity(0.06).text('PAID', 150, 350, { align: 'center', angle: -25 });
    doc.opacity(1);

    // Details Column 1
    doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text('Receipt No:', 50, 120);
    doc.font('Helvetica').text(transactionId, 150, 120);
    doc.font('Helvetica-Bold').text('Date:', 50, 140);
    doc.font('Helvetica').text(new Date().toLocaleDateString(), 150, 140);
    doc.font('Helvetica-Bold').text('Payment Mode:', 50, 160);
    doc.font('Helvetica').text(paymentMethod || 'Cash', 150, 160);

    // Table Layout for Member Details
    const tableTop = 220;
    doc.rect(50, tableTop, 500, 30).fill('#F3F4F6');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(11)
       .text('MEMBER DETAILS', 60, tableTop + 10);
       
    doc.rect(50, tableTop + 30, 500, 70).strokeColor('#E5E7EB').stroke();
    doc.font('Helvetica').fontSize(11)
       .text('Name:', 60, tableTop + 45).text(member.name, 150, tableTop + 45)
       .text('Phone:', 60, tableTop + 65).text(member.phone, 150, tableTop + 65)
       .text('Plan Base:', 60, tableTop + 85).text(member.planType, 150, tableTop + 85);

    const priceBoxTop = tableTop + 130;
    doc.rect(50, priceBoxTop, 500, 90).fill('#FDF2F8');
    doc.strokeColor('#FBCFE8').lineWidth(1).rect(50, priceBoxTop, 500, 90).stroke();
    
    doc.fillColor('#9D174D').fontSize(14).font('Helvetica-Bold')
       .text('Amount Paid:', 70, priceBoxTop + 20)
       .text(`Rs. ${amount.toLocaleString()}`, 400, priceBoxTop + 20);

    doc.fillColor('#BE185D').fontSize(10).font('Helvetica-Oblique')
       .text(`(Amount in words: ${numberToWords(parseInt(amount, 10) || 0)})`, 70, priceBoxTop + 45, { align: 'left' });

    doc.fillColor('#10B981').fontSize(12).font('Helvetica-Bold')
       .text(`Valid Till: ${newExpiry.toLocaleDateString()}`, 70, priceBoxTop + 65, { align: 'left' });

    doc.moveDown(5);
    doc.moveTo(50, 600).lineTo(550, 600).lineWidth(1).strokeColor('#E5E7EB').stroke();
    doc.fontSize(10).fillColor('#9CA3AF').text('This is a computer generated receipt and does not require a physical signature.', 50, 620, { align: 'center' });
    doc.fontSize(12).fillColor('#666666').font('Helvetica-Bold').text('Thank you for choosing GymOS! Keep Training.', 50, 650, { align: 'center' });

    doc.end();

    const receiptUrl = `${req.protocol}://${req.get('host')}/receipts/${receiptFilename}`;

    res.json({
      message: 'Payment marked successfully',
      member,
      receiptUrl,
      transactionId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
