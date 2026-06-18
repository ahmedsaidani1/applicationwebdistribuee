import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { loansAPI, setAuthToken } from '../services/api';

export default function Loans({ keycloak }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLoans();
  }, [keycloak]);

  const fetchLoans = async () => {
    try {
      setAuthToken(keycloak.token);
      const userId = keycloak.tokenParsed.sub;
      const response = await loansAPI.getUserLoans(userId);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
      showSnackbar('Erreur lors du chargement des emprunts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      setAuthToken(keycloak.token);
      await loansAPI.returnLoan(loanId);
      showSnackbar('Livre retourné avec succès !', 'success');
      fetchLoans();
    } catch (error) {
      console.error('Error returning book:', error);
      showSnackbar('Erreur lors du retour', 'error');
    }
  };

  const handleRenew = async (loanId) => {
    try {
      setAuthToken(keycloak.token);
      await loansAPI.renewLoan(loanId);
      showSnackbar('Emprunt renouvelé avec succès !', 'success');
      fetchLoans();
    } catch (error) {
      console.error('Error renewing loan:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors du renouvellement', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'Actif', color: 'success' },
      RETURNED: { label: 'Retourné', color: 'default' },
      OVERDUE: { label: 'En retard', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
        Mes emprunts
      </Typography>

      {loans.length === 0 ? (
        <Alert severity="info">
          Vous n'avez aucun emprunt en cours ou passé.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Livre</strong></TableCell>
                <TableCell><strong>Date d'emprunt</strong></TableCell>
                <TableCell><strong>Date de retour prévue</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Renouvellements</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <Typography variant="body2"><strong>{loan.bookTitle}</strong></Typography>
                    <Typography variant="caption" color="text.secondary">
                      ISBN: {loan.bookIsbn}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(loan.loanDate)}</TableCell>
                  <TableCell>{formatDate(loan.dueDate)}</TableCell>
                  <TableCell>{getStatusChip(loan.status)}</TableCell>
                  <TableCell>
                    {loan.renewalCount}/{loan.maxRenewals}
                  </TableCell>
                  <TableCell align="center">
                    {loan.status === 'ACTIVE' && (
                      <Box display="flex" gap={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleRenew(loan._id)}
                          disabled={loan.renewalCount >= loan.maxRenewals}
                        >
                          Renouveler
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleReturn(loan._id)}
                        >
                          Retourner
                        </Button>
                      </Box>
                    )}
                    {loan.status === 'RETURNED' && (
                      <Typography variant="caption" color="text.secondary">
                        Retourné le {formatDate(loan.returnDate)}
                      </Typography>
                    )}
                    {loan.status === 'OVERDUE' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleReturn(loan._id)}
                      >
                        Retourner (En retard)
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
