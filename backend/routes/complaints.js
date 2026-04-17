const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus, deleteComplaint } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .put(protect, admin, updateComplaintStatus)
  .delete(protect, deleteComplaint);

module.exports = router;
