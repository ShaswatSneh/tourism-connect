const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already exists!" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({
            success: true,
            message: "Registration successful",
            user: { name, email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: { name: user.name, email: user.email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
