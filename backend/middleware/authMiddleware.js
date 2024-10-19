const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

exports.verifyCompany = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received Token:', token); 

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decoded.id);

        if (!company) {
            return res.status(401).json({ message: 'Company not found, authorization denied' });
        }

        if (!company.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please verify your email or mobile.' });
        }

        req.company = company; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
