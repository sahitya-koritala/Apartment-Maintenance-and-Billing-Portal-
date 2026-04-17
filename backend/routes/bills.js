const express = require('express');
const router = express.Router();
const { generateBill, addSingleBill, getUserBills, payBill, getAllBills, deleteBill, updateBill, applyLateFee } = require('../controllers/billController');
const { protect, admin } = require('../middleware/auth');

router.post('/generate-bill', protect, admin, generateBill);
router.post('/add', protect, admin, addSingleBill);
router.get('/all', protect, admin, getAllBills); 
router.get('/:userId', protect, getUserBills);
router.put('/:id', protect, admin, updateBill);
router.put('/late-fee/:id', protect, admin, applyLateFee);
router.put('/pay/:id', protect, payBill);
router.delete('/:id', protect, admin, deleteBill);

module.exports = router;
