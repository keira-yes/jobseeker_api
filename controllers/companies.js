const Company = require('../models/Company');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json({
            success: true,
            results: companies.length,
            data: companies
        })
    } catch (err) {
        next(err);
    }
}

// @desc    Get company
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
        }

        res.status(200).json({
            success: true,
            data: company
        })
    } catch (err) {
        next(err);
    }
}

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = async (req, res, next) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json({
            success: true,
            data: company
        });
    } catch (err) {
        next(err);
    }
}

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err);
    }
}

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);

        if (!company) {
            return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
}