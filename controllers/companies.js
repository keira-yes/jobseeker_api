const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    const queryStr = { ...req.query };

    // Remove params from query string
    const removedParams = ['select'];
    removedParams.map(item => delete queryStr[item]);

    // Add $ to gt, gte, lt, lte, in for filtering
    const filters = JSON.stringify(queryStr).replace(/\b(gt|gte|lt|lte|in)\b/, str => `$${str}`);

    // Find companies by filters
    let companiesList = Company.find(JSON.parse(filters));

    //Select fields to display
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ');
        companiesList = companiesList.select(selectedFields);
    }

    const companies = await companiesList;
    res.status(200).json({ success: true, results: companies.length, data: companies });
});

// @desc    Get companies within a radius by zipcode and distance
// @route   DELETE /api/v1/companies/radius/:zipcode/:distance
// @access  Public
exports.getCompaniesWithinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get location from geocoder
    const location = await geocoder.geocode(zipcode);
    const lat = location[0].latitude;
    const lng = location[0].longitude;

    // Get radius by Earth radius (6378 km)
    const radius = distance / 6378;

    // Get companies by mongoose GeoJSON
    const companies = await Company.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } }
    });

    res.status(200).json({
        success: true,
        results: companies.length,
        data: companies
    });
});

// @desc    Get company by id
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