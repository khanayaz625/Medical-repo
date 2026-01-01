const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed Users (Run once or check on start)
router.post('/seed', async (req, res) => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) return res.json({ message: 'Users already seeded' });

        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const employeeHash = await bcrypt.hash('staff123', salt);

        await User.create([
            { username: 'admin', password: adminHash, role: 'admin' },
            { username: 'staff', password: employeeHash, role: 'employee' }
        ]);

        res.json({ message: 'Users seeded: admin/admin123, staff/staff123' });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding users' });
    }
});

module.exports = router;
