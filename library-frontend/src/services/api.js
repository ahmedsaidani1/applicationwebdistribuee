import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/api/books'),
  getById: (id) => api.get(`/api/books/${id}`),
  search: (keyword) => api.get(`/api/books/search?keyword=${keyword}`),
  getAvailable: () => api.get('/api/books/available'),
  create: (book) => api.post('/api/books', book),
  update: (id, book) => api.put(`/api/books/${id}`, book),
  delete: (id) => api.delete(`/api/books/${id}`),
  checkAvailability: (id) => api.get(`/api/books/${id}/availability`),
};

// Loans API
export const loansAPI = {
  getAll: () => api.get('/api/loans'),
  getById: (id) => api.get(`/api/loans/${id}`),
  getUserLoans: (userId) => api.get(`/api/loans/user/${userId}`),
  getActive: () => api.get('/api/loans/status/active'),
  getOverdue: () => api.get('/api/loans/status/overdue'),
  getStatistics: () => api.get('/api/loans/statistics'),
  create: (loan) => api.post('/api/loans', loan),
  returnLoan: (id) => api.put(`/api/loans/${id}/return`),
  renewLoan: (id) => api.put(`/api/loans/${id}/renew`),
};

export default api;
