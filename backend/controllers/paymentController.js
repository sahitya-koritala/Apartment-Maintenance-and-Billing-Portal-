const Payment = require('../models/Payment');
const Bill = require('../models/Bill');

exports.recordPayment = async (req, res) => {
  const { billId, amount, paymentMode } = req.body;

  try {
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const payment = await Payment.create({
      billId,
      amount,
      paymentMode
    });

    bill.status = 'paid';
    await bill.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: 'billId',
      populate: { path: 'flatId', select: 'flatNumber block' }
    }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editPayment = async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (amount !== undefined) payment.amount = Number(amount);
    if (paymentMode !== undefined) payment.paymentMode = paymentMode;

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Revert bill status to unpaid
    const bill = await Bill.findById(payment.billId);
    if (bill) {
      bill.status = 'unpaid';
      await bill.save();
    }

    res.json({ message: 'Payment deleted and bill reverted to unpaid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
