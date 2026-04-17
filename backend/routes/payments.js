const express = require('express');
const router = express.Router();
const { recordPayment, getAllPayments, editPayment, deletePayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, recordPayment);
router.get('/', protect, admin, getAllPayments);
router.put('/:id', protect, admin, editPayment);
router.delete('/:id', protect, admin, deletePayment);

module.exports = router;
