const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  const { title, description } = req.body;
  try {
    const notice = await Notice.create({ title, description });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    
    if (title) notice.title = title;
    if (description) notice.description = description;

    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
