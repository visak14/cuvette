// routes/auth.js (or wherever your routes are defined)
const express = require('express');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company'); // Adjust the path based on your structure
const router = express.Router();

router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the company by ID and set isVerified to true
        const company = await Company.findById(decoded.id);
        if (!company) {
            return res.status(400).json({ message: 'Invalid token or company not found' });
        }

        company.isVerified = true;
        await company.save();

        // Generate a new JWT for login
        const loginToken = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Optionally, return the login token in the response or redirect to the front-end with the token
        res.redirect(`${process.env.BASE_URL}/login?token=${loginToken}`);
    } catch (error) {
        return res.status(500).json({ message: 'Verification failed', error: error.message });
    }
});

module.exports = router;
