// src/EmployeeForm.js
import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Casual');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeName || !employeeId || !leaveStartDate || !leaveEndDate || !reason) {
      setErrorMessage('All fields are required');
      return;
    }

    const leaveRequest = {
      employeeName,
      employeeId,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      reason,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/submitLeave', leaveRequest);
      alert(response.data.message);
    } catch (error) {
      setErrorMessage('Error submitting leave request');
    }
  };

  return (
    <div>
      <h2>Submit Leave Request</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="Casual">Casual</option>
          <option value="Sick">Sick</option>
          <option value="Emergency">Emergency</option>
        </select>
        <input
          type="date"
          value={leaveStartDate}
          onChange={(e) => setLeaveStartDate(e.target.value)}
        />
        <input
          type="date"
          value={leaveEndDate}
          onChange={(e) => setLeaveEndDate(e.target.value)}
        />
        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <button type="submit">Submit Leave Request</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
