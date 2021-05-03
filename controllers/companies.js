const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    const companies = await Company.find();
    res.status(200).json({ success: true, results: companies.length, data: companies });
});

// @desc    Get company
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: company
    });
});

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.create(req.body);
    res.status(201).json({
        success: true,
        data: company
    });
});

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: company
    });
});

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});