import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  MenuBook,
  LibraryBooks,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { loansAPI, booksAPI, setAuthToken } from '../services/api';

export default function Home({ keycloak }) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setAuthToken(keycloak.token);
        
        const [booksRes, availableRes, loansStatsRes] = await Promise.all([
          booksAPI.getAll(),
          booksAPI.getAvailable(),
          loansAPI.getStatistics().catch(() => ({ data: { activeLoans: 0, overdueLoans: 0 } })),
        ]);

        setStats({
          totalBooks: booksRes.data.length,
          availableBooks: availableRes.data.length,
          activeLoans: loansStatsRes.data.activeLoans || 0,
          overdueLoans: loansStatsRes.data.overdueLoans || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [keycloak]);

  const statCards = [
    {
      title: 'Total Livres',
      value: stats.totalBooks,
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Livres Disponibles',
      value: stats.availableBooks,
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Emprunts Actifs',
      value: stats.activeLoans,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Emprunts en Retard',
      value: stats.overdueLoans,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
    },
  ];

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
        Tableau de bord
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenue, {keycloak?.tokenParsed?.preferred_username} !
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: card.color, color: 'white' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                    <Typography variant="body2">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
