const Loan = require('../models/Loan');
const bookService = require('./bookService');
const { publishEvent } = require('../config/rabbitmq');
const { loansCounter, activeLoansGauge } = require('../config/prometheus');

class LoanService {
    async createLoan(loanData) {
        // Check book availability using Feign-like sync call
        const availability = await bookService.checkBookAvailability(loanData.bookId);
        
        if (!availability.available) {
            throw new Error(`Book "${availability.title}" is not available for loan`);
        }

        // Get book details
        const book = await bookService.getBookById(loanData.bookId);
        
        // Calculate due date (default: 14 days)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Create loan
        const loan = new Loan({
            bookId: loanData.bookId,
            bookTitle: book.title,
            bookIsbn: book.isbn,
            userId: loanData.userId,
            userName: loanData.userName,
            userEmail: loanData.userEmail,
            dueDate: dueDate,
            notes: loanData.notes
        });

        await loan.save();

        // Decrease book availability (synchronous call)
        await bookService.decreaseBookAvailability(loanData.bookId);

        // Publish loan created event (asynchronous)
        await publishEvent('loan.created', {
            eventType: 'LOAN_CREATED',
            loanId: loan._id,
            bookId: loan.bookId,
            bookTitle: loan.bookTitle,
            userId: loan.userId,
            userName: loan.userName,
            userEmail: loan.userEmail,
            loanDate: loan.loanDate,
            dueDate: loan.dueDate,
            timestamp: Date.now()
        });

        // Update metrics
        loansCounter.inc({ status: 'created' });
        activeLoansGauge.inc();

        return loan;
    }

    async getAllLoans(filters = {}) {
        const query = {};
        
        if (filters.status) {
            query.status = filters.status;
        }
        
        if (filters.userId) {
            query.userId = filters.userId;
        }
        
        if (filters.bookId) {
            query.bookId = filters.bookId;
        }

        return await Loan.find(query).sort({ loanDate: -1 });
    }

    async getLoanById(loanId) {
        const loan = await Loan.findById(loanId);
        if (!loan) {
            throw new Error('Loan not found');
        }
        return loan;
    }

    async getUserLoans(userId) {
        return await Loan.find({ userId }).sort({ loanDate: -1 });
    }

    async getActiveLoans() {
        return await Loan.find({ status: 'ACTIVE' }).sort({ dueDate: 1 });
    }

    async getOverdueLoans() {
        return await Loan.find({ status: 'OVERDUE' }).sort({ dueDate: 1 });
    }

    async returnLoan(loanId) {
        const loan = await this.getLoanById(loanId);

        if (loan.status === 'RETURNED') {
            throw new Error('Book already returned');
        }

        loan.status = 'RETURNED';
        loan.returnDate = new Date();
        await loan.save();

        // Increase book availability (synchronous call)
        await bookService.increaseBookAvailability(loan.bookId);

        // Publish loan returned event (asynchronous)
        await publishEvent('loan.returned', {
            eventType: 'LOAN_RETURNED',
            loanId: loan._id,
            bookId: loan.bookId,
            bookTitle: loan.bookTitle,
            userId: loan.userId,
            userName: loan.userName,
            returnDate: loan.returnDate,
            wasOverdue: loan.isOverdue,
            timestamp: Date.now()
        });

        // Update metrics
        loansCounter.inc({ status: 'returned' });
        activeLoansGauge.dec();

        return loan;
    }

    async renewLoan(loanId) {
        const loan = await this.getLoanById(loanId);

        if (loan.status === 'RETURNED') {
            throw new Error('Cannot renew a returned loan');
        }

        if (loan.renewalCount >= loan.maxRenewals) {
            throw new Error(`Maximum renewals (${loan.maxRenewals}) reached`);
        }

        // Check if book is still available for renewal
        const availability = await bookService.checkBookAvailability(loan.bookId);
        if (!availability.available) {
            throw new Error('Book not available for renewal');
        }

        // Extend due date by 14 days
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14);
        
        loan.dueDate = newDueDate;
        loan.renewalCount += 1;
        loan.status = 'ACTIVE'; // Reset from OVERDUE if applicable
        await loan.save();

        // Publish loan renewed event
        await publishEvent('loan.renewed', {
            eventType: 'LOAN_RENEWED',
            loanId: loan._id,
            bookId: loan.bookId,
            userId: loan.userId,
            newDueDate: loan.dueDate,
            renewalCount: loan.renewalCount,
            timestamp: Date.now()
        });

        loansCounter.inc({ status: 'renewed' });

        return loan;
    }

    async checkOverdueLoans() {
        const overdueLoans = await Loan.find({
            status: 'ACTIVE',
            dueDate: { $lt: new Date() }
        });

        for (const loan of overdueLoans) {
            loan.status = 'OVERDUE';
            await loan.save();

            // Publish overdue notification
            await publishEvent('loan.overdue', {
                eventType: 'LOAN_OVERDUE',
                loanId: loan._id,
                bookId: loan.bookId,
                bookTitle: loan.bookTitle,
                userId: loan.userId,
                userName: loan.userName,
                userEmail: loan.userEmail,
                dueDate: loan.dueDate,
                daysOverdue: Math.floor((Date.now() - loan.dueDate) / (1000 * 60 * 60 * 24)),
                timestamp: Date.now()
            });
        }

        return overdueLoans;
    }

    async getLoanStatistics() {
        const totalLoans = await Loan.countDocuments();
        const activeLoans = await Loan.countDocuments({ status: 'ACTIVE' });
        const overdueLoans = await Loan.countDocuments({ status: 'OVERDUE' });
        const returnedLoans = await Loan.countDocuments({ status: 'RETURNED' });

        // Most borrowed books
        const popularBooks = await Loan.aggregate([
            {
                $group: {
                    _id: '$bookId',
                    bookTitle: { $first: '$bookTitle' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        return {
            totalLoans,
            activeLoans,
            overdueLoans,
            returnedLoans,
            popularBooks
        };
    }

    async getLoanCountByBookId(bookId) {
        return await Loan.countDocuments({ bookId });
    }
}


module.exports = new LoanService();
