const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    company_email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    employ_size: { type: Number, default: 0 },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    emailOTP: { type: String },        // Store email OTP
    emailOTPExpires: { type: Date },   // Email OTP expiry time
    mobileOTP: { type: String },       // Store mobile OTP
    mobileOTPExpires: { type: Date },  // Mobile OTP expiry time
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
