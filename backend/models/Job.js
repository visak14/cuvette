const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming you have a Company model
        required: true,
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
    }],
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
