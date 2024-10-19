const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator");
const twilio = require('twilio');

exports.register = async (req, res) => {
    const { name, company_name, company_email, mobile, employ_size } = req.body;

    if (!company_email || company_email.trim() === '') {
        return res.status(400).json({ message: 'Company email is required and cannot be empty' });
    }

    try {
        let company = await Company.findOne({ company_email });
        if (company) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const emailOTP = Math.floor(1000 + Math.random() * 9000).toString();
        const mobileOTP = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        company = new Company({
            name,
            company_name,
            company_email,
            mobile,
            employ_size: employ_size || 0,
            isVerified: false,
            emailOTP,
            emailOTPExpires: otpExpiry,
            mobileOTP,
            mobileOTPExpires: otpExpiry
        });

        await company.save();

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const mailOptions = {
            from: 'noreply@yourapp.com',
            to: company_email,
            subject: 'Verify your email',
            text: `Please verify your email by clicking the following link: 
                   ${process.env.BASE_URL}/api/auth/verify-email/${token}
                   Also, use the following OTP to verify your email: ${emailOTP}`
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending verification email', error: err.message });
            }

            const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
            client.messages.create({
                body: `Your mobile OTP for verification is: ${mobileOTP}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile
            })
            .then(async (message) => {
                console.log('SMS sent successfully', message.sid);
                res.status(200).json({ message: 'Registration successful. Please verify your email and mobile number.' });
            })
            .catch(err => {
                return res.status(500).json({ message: 'Error sending SMS OTP', error: err.message });
            });
        });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decoded.id);

        if (!company) {
            return res.status(400).json({ message: 'Invalid token or company does not exist' });
        }

        if (company.isVerified) {
            return res.status(400).json({ message: 'Company is already verified' });
        }

        company.isVerified = true;
        await company.save();

        res.status(200).json({ message: 'Email verification successful' });
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(400).json({ message: 'Invalid or expired token', error: error.message });
    }
};

exports.verifyEmailOTP = async (req, res) => {
    const { emailOTP, company_email } = req.body;

    try {
        const company = await Company.findOne({ company_email });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const currentTime = Date.now();

        if (company.emailOTP !== emailOTP) {
            return res.status(400).json({ message: 'Invalid email OTP' });
        }

        if (currentTime > company.emailOTPExpires) {
            return res.status(400).json({ message: 'Email OTP has expired' });
        }

        company.isEmailVerified = true;
        company.emailOTP = null;
        await company.save();

        return res.status(200).json({ message: 'Email OTP verified successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.verifyMobileOTP = async (req, res) => {
    const { mobileOTP, mobile } = req.body;

    try {
        const company = await Company.findOne({ mobile });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const currentTime = Date.now();

        if (company.mobileOTP !== mobileOTP) {
            return res.status(400).json({ message: 'Invalid mobile OTP' });
        }

        if (currentTime > company.mobileOTPExpires) {
            return res.status(400).json({ message: 'Mobile OTP has expired' });
        }

        company.isMobileVerified = true;
        company.mobileOTP = null;
        await company.save();

        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({ message: 'Mobile OTP verified successfully', token });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });

    if (!company) {
        return res.status(400).json({ message: 'Company not found' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });
};

exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};
