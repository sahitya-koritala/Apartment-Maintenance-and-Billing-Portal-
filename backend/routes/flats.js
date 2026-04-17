const express = require('express');
const router = express.Router();
const { getFlats, addFlat, assignResident, deleteFlat } = require('../controllers/flatController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getFlats)
  .post(protect, admin, addFlat);

router.route('/:id')
  .put(protect, admin, assignResident)
  .delete(protect, admin, deleteFlat);

module.exports = router;
