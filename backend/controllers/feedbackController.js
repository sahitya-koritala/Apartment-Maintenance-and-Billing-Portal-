const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { rating, review } = req.body;
  try {
    const feedback = await Feedback.create({
      userId: req.user._id,
      rating,
      review
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    // Only Admin can see all feedback OR fetch all for everyone? Let's let everyone see feedback as testimonials.
    const feedbacks = await Feedback.find()
      .populate({
        path: 'userId',
        select: 'name role',
        populate: { path: 'flatId', select: 'flatNumber block' }
      })
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    
    // Allow resident to delete their own, and allow admin to delete any
    if (req.user.role !== 'admin' && feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
