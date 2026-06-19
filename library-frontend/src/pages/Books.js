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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Search, Book as BookIcon, Add, Edit, Delete } from '@mui/icons-material';
import { booksAPI, loansAPI, setAuthToken } from '../services/api';

export default function Books({ keycloak }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationDate: '',
    category: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1
  });
  const [formErrors, setFormErrors] = useState({});

  const isAdmin = keycloak.hasRealmRole('ADMIN') || keycloak.hasRealmRole('LIBRARIAN');
  const isFullAdmin = keycloak.hasRealmRole('ADMIN');

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

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher || '',
        publicationDate: book.publicationDate || '',
        category: book.category,
        description: book.description || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publicationDate: '',
        category: '',
        description: '',
        totalCopies: 1,
        availableCopies: 1
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'availableCopies' ? parseInt(value) || 0 : value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title || formData.title.trim().length < 2) {
      errors.title = 'Le titre doit contenir au moins 2 caractères';
    }
    
    if (!formData.author || formData.author.trim().length < 2) {
      errors.author = 'L\'auteur doit contenir au moins 2 caractères';
    }
    
    // ISBN validation: should be 10 or 13 digits (with optional hyphens)
    const isbnClean = formData.isbn.replace(/[-\s]/g, '');
    if (!formData.isbn || (isbnClean.length !== 10 && isbnClean.length !== 13)) {
      errors.isbn = 'L\'ISBN doit contenir 10 ou 13 chiffres';
    }
    
    if (!formData.publisher || formData.publisher.trim().length < 2) {
      errors.publisher = 'L\'éditeur doit contenir au moins 2 caractères';
    }
    
    if (!formData.publicationDate) {
      errors.publicationDate = 'La date de publication est requise';
    } else {
      const pubDate = new Date(formData.publicationDate);
      const today = new Date();
      if (pubDate > today) {
        errors.publicationDate = 'La date ne peut pas être dans le futur';
      }
    }
    
    if (!formData.category || formData.category.trim().length < 2) {
      errors.category = 'La catégorie doit contenir au moins 2 caractères';
    }
    
    if (formData.totalCopies < 1) {
      errors.totalCopies = 'Le nombre d\'exemplaires doit être au moins 1';
    }
    
    if (formData.availableCopies < 0) {
      errors.availableCopies = 'Le nombre d\'exemplaires disponibles ne peut pas être négatif';
    }
    
    if (formData.availableCopies > formData.totalCopies) {
      errors.availableCopies = 'Les exemplaires disponibles ne peuvent pas dépasser le total';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    
    try {
      setAuthToken(keycloak.token);
      if (editingBook) {
        await booksAPI.update(editingBook.id, formData);
        showSnackbar('Livre mis à jour avec succès !', 'success');
      } else {
        await booksAPI.create(formData);
        showSnackbar('Livre créé avec succès !', 'success');
      }
      fetchBooks();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving book:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      return;
    }
    try {
      setAuthToken(keycloak.token);
      await booksAPI.delete(bookId);
      showSnackbar('Livre supprimé avec succès !', 'success');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Catalogue de livres
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un livre
          </Button>
        )}
      </Box>

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
                  <Box>
                    <Chip
                      label={book.availableCopies > 0 ? 'Disponible' : 'Indisponible'}
                      color={book.availableCopies > 0 ? 'success' : 'error'}
                      size="small"
                    />
                    {isAdmin && (
                      <Box display="inline" ml={1}>
                        <IconButton size="small" onClick={() => handleOpenDialog(book)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        {isFullAdmin && (
                          <IconButton size="small" color="error" onClick={() => handleDelete(book.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBook ? 'Modifier le livre' : 'Ajouter un livre'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.title}
              helperText={formErrors.title}
            />
            <TextField
              label="Auteur"
              name="author"
              value={formData.author}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.author}
              helperText={formErrors.author}
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.isbn}
              helperText={formErrors.isbn}
              placeholder="978-0-123456-78-9"
            />
            <TextField
              label="Éditeur"
              name="publisher"
              value={formData.publisher}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.publisher}
              helperText={formErrors.publisher}
            />
            <TextField
              label="Date de publication"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.publicationDate}
              helperText={formErrors.publicationDate}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.category}
              helperText={formErrors.category}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Total exemplaires"
              name="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.totalCopies}
              helperText={formErrors.totalCopies}
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Exemplaires disponibles"
              name="availableCopies"
              type="number"
              value={formData.availableCopies}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.availableCopies}
              helperText={formErrors.availableCopies}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBook ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

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
