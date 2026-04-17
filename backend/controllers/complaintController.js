const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  const { title, description } = req.body;
  try {
    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find()
        .populate({
          path: 'userId',
          select: 'name email',
          populate: { path: 'flatId', select: 'flatNumber block' }
        })
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ userId: req.user._id })
        .populate({
          path: 'userId',
          select: 'name email',
          populate: { path: 'flatId', select: 'flatNumber block' }
        })
        .sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = req.body.status || complaint.status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    // Allow resident to delete their own, and allow admin to delete any
    if (req.user.role !== 'admin' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
