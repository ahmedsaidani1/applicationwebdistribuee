const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: [true, 'Book ID is required'],
        index: true
    },
    bookTitle: {
        type: String,
        required: [true, 'Book title is required']
    },
    bookIsbn: {
        type: String
    },
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    },
    userEmail: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    loanDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'RETURNED', 'OVERDUE'],
        default: 'ACTIVE',
        index: true
    },
    notes: {
        type: String,
        maxlength: 500
    },
    renewalCount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxRenewals: {
        type: Number,
        default: 2
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for days remaining
loanSchema.virtual('daysRemaining').get(function() {
    if (this.status === 'RETURNED') return 0;
    const now = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for is overdue
loanSchema.virtual('isOverdue').get(function() {
    if (this.status === 'RETURNED') return false;
    return new Date() > new Date(this.dueDate);
});

// Pre-save hook to update status
loanSchema.pre('save', function(next) {
    if (this.status !== 'RETURNED' && new Date() > new Date(this.dueDate)) {
        this.status = 'OVERDUE';
    }
    next();
});

// Index for common queries
loanSchema.index({ userId: 1, status: 1 });
loanSchema.index({ bookId: 1, status: 1 });
loanSchema.index({ dueDate: 1, status: 1 });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
