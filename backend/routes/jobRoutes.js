const express = require('express');
const { postJob, addCandidate ,getJobs } = require('../controllers/jobController');
const { verifyCompany } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post-job', verifyCompany, postJob); 
router.post('/add-candidate', verifyCompany, addCandidate);
router.get('/jobs', getJobs); 

module.exports = router;
