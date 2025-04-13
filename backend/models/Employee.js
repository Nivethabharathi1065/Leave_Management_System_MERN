// models/Employee.js
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  leaveType: { type: String, enum: ['Casual', 'Sick', 'Emergency'], required: true },
  leaveStartDate: { type: Date, required: true },
  leaveEndDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  adminComment: { type: String },
});

const Employee = mongoose.model('Employee', leaveRequestSchema);
module.exports = Employee;
