const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    // Mongoose error - ObjectId failed
    if (err.name === 'CastError') {
        const message = `Company with id ${err.value} not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose error - Duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value was found';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose error - Validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message)
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;