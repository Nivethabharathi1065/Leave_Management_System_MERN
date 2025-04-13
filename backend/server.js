require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leave_management_system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Updated to match frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  employeeId: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  department: String,
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
}));

const Leave = mongoose.model('Leave', new mongoose.Schema({
  employeeId: String,
  name: String,
  department: String,
  leaveType: { type: String, enum: ['Casual', 'Sick', 'Emergency'] },
  fromDate: Date,
  toDate: Date,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  comment: String,
  createdAt: { type: Date, default: Date.now },
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, employeeId, email, password, department, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      employeeId,
      email,
      password: hashedPassword,
      department,
      role: role || 'employee'
    });
    
    await user.save();
    
    const token = jwt.sign(
      { _id: user._id, employeeId: user.employeeId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token,
      user: {
        name: user.name,
        employeeId: user.employeeId,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Employee ID or Email already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const user = await User.findOne({ employeeId });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { _id: user._id, employeeId: user.employeeId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({ 
      token,
      user: {
        name: user.name,
        employeeId: user.employeeId,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected routes middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Leave routes
app.post('/api/leaves', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ employeeId: req.user.employeeId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { leaveType, fromDate, toDate, reason } = req.body;
    
    const leave = new Leave({
      employeeId: user.employeeId,
      name: user.name,
      department: user.department,
      leaveType,
      fromDate,
      toDate,
      reason
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Error applying leave' });
  }
});

app.get('/api/leaves/employee', authenticate, async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
});

app.get('/api/leaves/admin', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
});

app.patch('/api/leaves/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, comment } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, comment },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});