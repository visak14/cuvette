const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate; 
