const Flat = require('../models/Flat');
const User = require('../models/User');

exports.getFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate('ownerId', 'name email');
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addFlat = async (req, res) => {
  const { flatNumber, block, floor } = req.body;
  try {
    const flatExists = await Flat.findOne({ flatNumber });
    if (flatExists) {
      return res.status(400).json({ message: 'Flat already exists' });
    }
    const flat = await Flat.create({ flatNumber, block, floor });
    res.status(201).json(flat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json({ message: 'Flat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignResident = async (req, res) => {
  const { id } = req.params;
  const { ownerId } = req.body;
  try {
    const flat = await Flat.findById(id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    flat.ownerId = ownerId;
    await flat.save();

    await User.findByIdAndUpdate(ownerId, { flatId: flat._id });

    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
