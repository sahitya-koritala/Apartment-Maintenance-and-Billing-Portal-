const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true, unique: true },
  block: { type: String, required: true },
  floor: { type: Number, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Resident assigned to flat
}, { timestamps: true });

module.exports = mongoose.model('Flat', flatSchema);
