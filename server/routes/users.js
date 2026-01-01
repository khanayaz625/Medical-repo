const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get All Users (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Create User (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    console.log('Attempting to create user:', req.body.username);
    const { username, password, role } = req.body;
    try {
        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            console.log('User already exists:', username);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'employee'
        });

        await newUser.save();
        console.log('User created successfully:', username);
        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user: ' + error.message });
    }
});

// Delete User (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Update User Password (Admin only)
router.put('/:id/password', verifyToken, verifyAdmin, async (req, res) => {
    const { password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password' });
    }
});

module.exports = router;
