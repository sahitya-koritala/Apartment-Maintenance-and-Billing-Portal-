const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice, editNotice } = require('../controllers/noticeController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, admin, createNotice)
  .get(protect, getNotices);

router.route('/:id')
  .put(protect, admin, editNotice)
  .delete(protect, admin, deleteNotice);

module.exports = router;
