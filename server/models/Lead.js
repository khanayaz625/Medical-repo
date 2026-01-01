const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Lost'], default: 'New' },
    notes: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
