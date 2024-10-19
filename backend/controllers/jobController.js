const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const nodemailer = require('nodemailer');

exports.postJob = async (req, res) => {
    try {
        const { title, description, experienceLevel, endDate, candidates } = req.body;

        console.log('Received Candidates:', candidates);

        if (!candidates || candidates.length === 0) {
            return res.status(400).json({ message: 'No candidates provided.' });
        }

        const invalidCandidates = candidates.filter(candidate => !candidate.email);
        if (invalidCandidates.length > 0) {
            return res.status(400).json({
                message: 'Some candidates are missing email addresses.',
                invalidCandidates,
            });
        }

        const job = new Job({
            title,
            description,
            experienceLevel,
            endDate,
            company: req.company._id,
        });

        for (const candidateData of candidates) {
            const { email } = candidateData;

            let candidate = await Candidate.findOne({ email });
            if (!candidate) {
                candidate = new Candidate({ email, job: job._id });
                await candidate.save();
            } else {
                if (!candidate.job.equals(job._id)) {
                    candidate.job = job._id;
                    await candidate.save();
                }
            }

            job.candidates.push(candidate._id);
        }

        await job.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        for (const candidateData of candidates) {
            const { email } = candidateData;

            const mailOptions = {
                from: 'noreply@yourapp.com',
                to: email,
                subject: `Exciting Job Opportunity: ${job.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Hello,</h2>
                        <p>We are excited to inform you that a new job opportunity has been posted that might interest you!</p>
                        <h3>Job Title: ${job.title}</h3>
                        <p><strong>Description:</strong> ${job.description}</p>
                        <p><strong>Experience Level:</strong> ${job.experienceLevel}</p>
                        <p><strong>Application Deadline:</strong> ${new Date(job.endDate).toLocaleDateString()}</p>
                        <p>We encourage you to check out the details and consider applying. You can view the job listing <a href="http://yourapp.com/jobs/${job._id}">here</a>.</p>
                        <p>If you have any questions, feel free to reach out to us.</p>
                        <p>Best regards,<br>Your Company Team</p>
                    </div>
                `,
            };

            try {
                console.log(`Sending email to: ${email}`);
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}`);
            } catch (err) {
                console.error(`Failed to send email to ${email}:`, err);
            }
        }

        res.json({ message: 'Job posted successfully, emails sent to candidates', job });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Error posting job' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .populate('company', 'name')
            .populate('candidates', 'email')
            .exec();

        res.json(jobs);
    } catch (error) {
        console.error('Error retrieving jobs:', error);
        res.status(500).json({ message: 'Error retrieving jobs' });
    }
};

exports.addCandidate = async (req, res) => {
    try {
        const { email, jobId } = req.body;

        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            candidate = new Candidate({ email, job: jobId });
            await candidate.save();
        } else {
            if (!candidate.job.equals(jobId)) {
                candidate.job = jobId;
                await candidate.save();
            }
        }

        const job = await Job.findById(jobId);
        job.candidates.push(candidate._id);
        await job.save();

        let transporter = nodemailer.createTransport({ /* SMTP configuration */ });
        const mailOptions = {
            from: 'noreply@yourapp.com',
            to: email,
            subject: 'New Job Posting!',
            text: `A new job titled "${job.title}" has been posted. Please check it out.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Candidate added and email sent successfully' });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ message: 'Error adding candidate' });
    }
};
