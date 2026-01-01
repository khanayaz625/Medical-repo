const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { verifyToken } = require('../middleware/auth');

// Get All Leads
router.get('/', verifyToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads' });
    }
});

// Create Lead
router.post('/', verifyToken, async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lead' });
    }
});

// Update Lead
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead' });
    }
});

// Delete Lead
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lead' });
    }
});

module.exports = router;
