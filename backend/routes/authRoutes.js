const express = require('express');
const { register, login, logout , verifyEmail , verifyEmailOTP , verifyMobileOTP} = require('../controllers/authController');
const { verifyCompany } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login); 
router.post('/logout', verifyCompany, logout); 
router.post('/verify-email-otp' , verifyEmailOTP  )
router.post('/verify-mobile-otp' , verifyMobileOTP)
module.exports = router;
