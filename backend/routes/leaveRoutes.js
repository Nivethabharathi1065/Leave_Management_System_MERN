const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/apply', leaveController.applyLeave);
router.get('/all', leaveController.getAllLeaves);
router.put('/update/:id', leaveController.updateLeaveStatus);
router.get('/employee/:empId', leaveController.getLeavesByEmployee);

module.exports = router;
