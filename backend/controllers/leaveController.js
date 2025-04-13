const Leave = require('./models/Leave');

// Apply for leave
exports.applyLeave = async (req, res) => {
    try {
        const leave = new Leave(req.body);
        await leave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all leave requests (admin)
exports.getAllLeaves = async (req, res) => {
    try {
        const { name, status, from, to } = req.query;

        let filter = {};

        if (name) filter.employeeName = { $regex: name, $options: 'i' };
        if (status) filter.status = status;
        if (from && to) filter.fromDate = { $gte: new Date(from), $lte: new Date(to) };

        const leaves = await Leave.find(filter).sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update leave status
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body;

        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status, adminComment },
            { new: true }
        );

        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get leave requests by employee
exports.getLeavesByEmployee = async (req, res) => {
    try {
        const { empId } = req.params;
        const leaves = await Leave.find({ employeeId: empId }).sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
