function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID format',
            error: err.message
        });
    }

    // Custom application errors
    if (err.message) {
        const statusCode = err.statusCode || 400;
        return res.status(statusCode).json({
            message: err.message,
            status: statusCode
        });
    }

    // Default error
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}

module.exports = errorHandler;
