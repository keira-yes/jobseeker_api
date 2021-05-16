const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @route   GET /api/v1/companies/:companyId/jobs
// @access  Public

exports.getJobs = asyncHandler(async(req, res, next) => {
    let jobsList;

    if (req.params.companyId) {
        jobsList = Job.find({ company: req.params.companyId });
    } else {
        jobsList = Job.find();
    }

    const jobs = await jobsList;

    res.status(200).json({ success: true, total: jobs.length, data: jobs });
})