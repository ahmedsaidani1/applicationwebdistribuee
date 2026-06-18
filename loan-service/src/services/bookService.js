const axios = require('axios');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:8081';

class BookService {
    async getBookById(bookId) {
        try {
            const response = await axios.get(`${BOOK_SERVICE_URL}/books/${bookId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book:', error.message);
            throw new Error(`Unable to fetch book with ID ${bookId}`);
        }
    }

    async checkBookAvailability(bookId) {
        try {
            const response = await axios.get(`${BOOK_SERVICE_URL}/books/${bookId}/availability`);
            return response.data;
        } catch (error) {
            console.error('Error checking book availability:', error.message);
            throw new Error(`Unable to check availability for book ${bookId}`);
        }
    }

    async decreaseBookAvailability(bookId) {
        try {
            await axios.put(`${BOOK_SERVICE_URL}/books/${bookId}/decrease-availability`);
            console.log(`✅ Decreased availability for book ${bookId}`);
        } catch (error) {
            console.error('Error decreasing book availability:', error.message);
            throw new Error(`Unable to decrease availability for book ${bookId}`);
        }
    }

    async increaseBookAvailability(bookId) {
        try {
            await axios.put(`${BOOK_SERVICE_URL}/books/${bookId}/increase-availability`);
            console.log(`✅ Increased availability for book ${bookId}`);
        } catch (error) {
            console.error('Error increasing book availability:', error.message);
            throw new Error(`Unable to increase availability for book ${bookId}`);
        }
    }

    async searchBooks(keyword) {
        try {
            const response = await axios.get(`${BOOK_SERVICE_URL}/books/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            console.error('Error searching books:', error.message);
            throw new Error('Unable to search books');
        }
    }
}

module.exports = new BookService();
