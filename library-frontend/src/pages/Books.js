import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Search, Book as BookIcon } from '@mui/icons-material';
import { booksAPI, loansAPI, setAuthToken } from '../services/api';

export default function Books({ keycloak }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBooks();
  }, [keycloak]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setAuthToken(keycloak.token);
      const response = await booksAPI.getAll();
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      showSnackbar('Erreur lors du chargement des livres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (book) => {
    try {
      setAuthToken(keycloak.token);
      const loan = {
        bookId: book.id,
        userId: keycloak.tokenParsed.sub,
        userName: keycloak.tokenParsed.preferred_username,
        userEmail: keycloak.tokenParsed.email || `${keycloak.tokenParsed.preferred_username}@library.com`,
      };
      
      await loansAPI.create(loan);
      showSnackbar(`Livre "${book.title}" emprunté avec succès !`, 'success');
      fetchBooks(); // Refresh to update availability
    } catch (error) {
      console.error('Error borrowing book:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de l\'emprunt', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Catalogue de livres
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par titre, auteur ou catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {filteredBooks.length} livre(s) trouvé(s)
      </Typography>

      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <BookIcon color="primary" />
                  <Chip
                    label={book.availableCopies > 0 ? 'Disponible' : 'Indisponible'}
                    color={book.availableCopies > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography gutterBottom variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Auteur:</strong> {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Catégorie:</strong> {book.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ISBN:</strong> {book.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Exemplaires disponibles:</strong> {book.availableCopies}/{book.totalCopies}
                </Typography>
                {book.description && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {book.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  disabled={book.availableCopies === 0}
                  onClick={() => handleBorrow(book)}
                >
                  Emprunter
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredBooks.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Aucun livre trouvé avec les critères de recherche.
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
