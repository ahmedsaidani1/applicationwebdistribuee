const Joi = require('joi');

const loanSchema = Joi.object({
    bookId: Joi.number().required().messages({
        'any.required': 'Book ID is required',
        'number.base': 'Book ID must be a number'
    }),
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required',
        'string.base': 'User ID must be a string'
    }),
    userName: Joi.string().required().messages({
        'any.required': 'User name is required',
        'string.base': 'User name must be a string'
    }),
    userEmail: Joi.string().email().optional().messages({
        'string.email': 'Invalid email format'
    }),
    notes: Joi.string().max(500).optional().messages({
        'string.max': 'Notes cannot exceed 500 characters'
    })
});

function validateLoan(req, res, next) {
    const { error } = loanSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));
        
        console.error('Loan validation failed:', errors);
        console.error('Request body:', req.body);
        
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }
    
    next();
}

module.exports = {
    validateLoan
};
