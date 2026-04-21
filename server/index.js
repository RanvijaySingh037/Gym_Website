const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Attach io to the req object so we can use it in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
const PORT = process.env.PORT || 5000;

// Configure CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/receipts', express.static(path.join(__dirname, 'public/receipts')));

// Health Check & Welcome Message
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Gym Management System API", status: "Running", version: "1.0.0" });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/member-portal', require('./routes/memberPortal'));

// Database Connection
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gymos', {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
