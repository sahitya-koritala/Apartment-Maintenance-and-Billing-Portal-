const User = require('../models/User');
const Bill = require('../models/Bill');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalResidents = await User.countDocuments({ role: 'resident' });
    const pendingBillsCount = await Bill.countDocuments({ status: 'unpaid' });
    const complaintsCount = await Complaint.countDocuments({ status: 'Pending' });
    
    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    
    const paymentsThisMonth = await Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    
    const monthlyRevenue = paymentsThisMonth.length > 0 ? paymentsThisMonth[0].totalRevenue : 0;

    // Pending dues
    const pendingBills = await Bill.aggregate([
      { $match: { status: 'unpaid' } },
      { $group: { _id: null, totalPending: { $sum: '$totalAmount' } } }
    ]);
    const totalPendingAmount = pendingBills.length > 0 ? pendingBills[0].totalPending : 0;

    res.json({
      totalResidents,
      pendingBillsCount,
      complaintsCount,
      monthlyRevenue,
      totalPendingAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
