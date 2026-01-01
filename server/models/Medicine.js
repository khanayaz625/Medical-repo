const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNo: { type: String },
  expiryDate: { type: String },
  manufacturer: { type: String },
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  description: { type: String },
  // Adding flexible fields for "multiple required data"
  additionalInfo: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
