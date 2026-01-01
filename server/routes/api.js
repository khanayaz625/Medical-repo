const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Medicine = require('../models/Medicine');
const PatientCheckup = require('../models/PatientCheckup');
const fs = require('fs');

// Multer Setup
const upload = multer({ dest: 'uploads/' });

// --- Medicine Routes ---

// Upload Medicines via XLSX
router.post('/upload-medicines', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Process data and save to DB
        const medicines = data.map(item => ({
            name: item.Name || item.name,
            price: item.Price || item.price || 0,
            quantity: item.Quantity || item.quantity || 0,
            batchNo: item.BatchNo || item.batchNo || '',
            expiryDate: item.ExpiryDate || item.expiryDate || '',
            manufacturer: item.Manufacturer || item.manufacturer || '',
            description: item.Description || item.description || '',
            additionalInfo: item // Store all other fields just in case
        }));

        // Bulk write (upsert based on name + batchNo usually, but let's just insert for now or upsert based on name)
        // For simplicity, we will just insert all. User might want to clear old ones? 
        // Let's assume appending/updating. We'll use bulkWrite for efficiency.
        const ops = medicines.map(med => ({
            updateOne: {
                filter: { name: med.name },
                update: { $set: med },
                upsert: true
            }
        }));

        if (ops.length > 0) {
            await Medicine.bulkWrite(ops);
        }

        // Cleanup file
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: 'Medicines uploaded successfully', count: ops.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
});

// Get All Medicines
router.get('/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicines' });
    }
});

// Update Medicine (Quantity, Price, etc.)
router.put('/medicines/:id', async (req, res) => {
    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medicine' });
    }
});

// --- Checkup Routes ---

// Create New Checkup
// Create New Checkup
router.post('/checkups', async (req, res) => {
    try {
        const newCheckup = new PatientCheckup(req.body);
        await newCheckup.save();

        // Automatically add to Leads as 'Converted' (since they paid for a checkup)
        // Check if lead exists first to avoid duplicates or update status
        // Using dynamic import or require Model here if standard require is at top
        const Lead = require('../models/Lead');
        const existingLead = await Lead.findOne({ contact: req.body.contact });

        if (existingLead) {
            existingLead.status = 'Converted';
            existingLead.notes = (existingLead.notes || '') + ` | Checkup done: ${req.body.checkupType}`;
            await existingLead.save();
        } else {
            await Lead.create({
                name: req.body.patientName,
                contact: req.body.contact,
                status: 'Converted', // They are a customer now
                notes: `Auto-generated from Checkup: ${req.body.checkupType}`
            });
        }

        res.status(201).json(newCheckup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating checkup', error: error.message });
    }
});

// Public Appointment Booking (Saves to Leads)
router.post('/public/appointment', async (req, res) => {
    try {
        const { name, contact, reason, date } = req.body;
        const Lead = require('../models/Lead');

        // Create a new Lead with status 'New'
        const newLead = await Lead.create({
            name,
            contact,
            status: 'New',
            notes: `Online Appointment Request. Reason: ${reason}. Preferred Date: ${date}`
        });

        res.status(201).json({ message: 'Appointment booked successfully', lead: newLead });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
});

// Get Checkups
router.get('/checkups', async (req, res) => {
    try {
        const checkups = await PatientCheckup.find().sort({ createdAt: -1 });
        res.json(checkups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching checkups' });
    }
});

module.exports = router;
