// routes/leaveRequests.js
const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Submit leave request
router.post('/submitLeave', async (req, res) => {
  const { employeeName, employeeId, leaveType, leaveStartDate, leaveEndDate, reason } = req.body;

  try {
    const newLeaveRequest = new Employee({
      employeeName,
      employeeId,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      reason,
    });

    await newLeaveRequest.save();
    res.status(201).json({ success: true, message: 'Leave request submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting leave request' });
  }
});

// Get all leave requests for admin
router.get('/getLeaveRequests', async (req, res) => {
  try {
    const leaveRequests = await Employee.find();
    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leave requests' });
  }
});

// Approve or reject leave request
router.post('/updateLeaveStatus', async (req, res) => {
  const { leaveRequestId, status, adminComment } = req.body;
  try {
    const leaveRequest = await Employee.findById(leaveRequestId);
    leaveRequest.status = status;
    leaveRequest.adminComment = adminComment;
    await leaveRequest.save();
    res.status(200).json({ success: true, message: 'Leave status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating leave status' });
  }
});

module.exports = router;
