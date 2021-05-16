const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Company = require('../models/Company');
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
        jobsList = Job.find().populate({
            path: 'company',
            select: 'name website'
        });
    }

    const jobs = await jobsList;

    res.status(200).json({ success: true, total: jobs.length, data: jobs });
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public

exports.getJob = asyncHandler(async(req, res, next) => {
   const job = await Job.findById(req.params.id).populate({
       path: 'company',
       select: 'name website'
   });

    if (!job) {
        return next(new ErrorResponse(`Job with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({ success: true, data: job });
});

// @desc    Create new job
// @route   POST /api/v1/companies/companyId/jobs
// @access  Private

exports.createJob = asyncHandler(async(req, res, next) => {
    req.body.company = req.params.companyId;

    const company = await Company.findById(req.params.companyId);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
});