const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.extendedResults);
});

// @desc    Get companies within a radius by zipcode and distance
// @route   GET /api/v1/companies/radius/:zipcode/:distance
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

    res.status(200).json({ success: true, total: companies.length, data: companies });
});

// @desc    Get single company
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({ success: true, data: company });
});

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
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

    res.status(200).json({ success: true, data: company });
});

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    await company.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Upload company photo
// @route   PUT /api/v1/companies/:id/upload
// @access  Private
exports.uploadCompanyPhoto = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorResponse(`Company with id ${req.params.id} not found`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a company photo`, 400));
    }

    const image = req.files.file;

    if (!image.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image`, 400));
    }

    if (image.size > process.env.MAX_MAX_UPLOAD_FILE_SIZE) {
        return next(new ErrorResponse(`Your photo is too large, recommended size is less than ${process.env.MAX_MAX_UPLOAD_FILE_SIZE}`, 400));
    }

    // Add uniq photo name
    image.name = `photo_${company._id}${path.parse(image.name).ext}`;

    image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Photo uploading has some problem`, 500));
        }

        await Company.findByIdAndUpdate(req.params.id, { photo: image.name });

        res.status(200).json({
            success: true,
            data: image.name
        });
    });
});