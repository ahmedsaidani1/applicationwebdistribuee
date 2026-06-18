import React from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { LocalLibrary, Login as LoginIcon } from '@mui/icons-material';

export default function Login({ keycloak }) {
  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Stack spacing={3} alignItems="center">
            <LocalLibrary sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography component="h1" variant="h4">
              Bibliothèque en ligne
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Système de gestion de bibliothèque basé sur une architecture microservices
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              fullWidth
            >
              Se connecter avec Keycloak
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Comptes de test :
              </Typography>
              <Typography variant="caption" display="block">
                • admin / admin123 (ADMIN)
              </Typography>
              <Typography variant="caption" display="block">
                • librarian / librarian123 (LIBRARIAN)
              </Typography>
              <Typography variant="caption" display="block">
                • user / user123 (USER)
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
