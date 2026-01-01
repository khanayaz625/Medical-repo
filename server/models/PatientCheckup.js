const mongoose = require('mongoose');

const PatientCheckupSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    contact: { type: String },
    checkupType: { type: String, required: true }, // e.g., 'Full Body', 'CBC', 'Widal'
    checkupDetails: { type: Object }, // To store specific test results like { hemoglobin: 12, etc. }
    totalCost: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PatientCheckup', PatientCheckupSchema);
