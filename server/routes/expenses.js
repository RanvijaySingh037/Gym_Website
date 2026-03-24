const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

let mockExpenses = []; // Fallback memory store

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    console.warn("DB find failed, using mock data for expenses");
    res.json(mockExpenses);
  }
});

// Add an expense
router.post('/', async (req, res) => {
  const { title, amount, category, date } = req.body;
  const expense = new Expense({ title, amount, category, date });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.warn("DB save failed, using mock data for expenses");
    const newMockExpense = {
      _id: Date.now().toString(),
      title, amount, category, date
    };
    mockExpenses.push(newMockExpense);
    res.status(201).json(newMockExpense);
  }
});

module.exports = router;
