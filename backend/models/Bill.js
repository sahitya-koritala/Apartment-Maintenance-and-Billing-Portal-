const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  flatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  month: { type: String, required: true }, // e.g. "January 2026"
  maintenance: { type: Number, required: true },
  water: { type: Number, default: 0 },
  electricity: { type: Number, default: 0 },
  parking: { type: Number, default: 0 },
  extraCharges: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 },
  dueDate: { type: Date },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
