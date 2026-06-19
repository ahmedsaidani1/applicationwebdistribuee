import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Keycloak from 'keycloak-js';

import Layout from './components/Layout';
import Home from './pages/Home';
import Books from './pages/Books';
import Loans from './pages/Loans';
import Login from './pages/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8180',
  realm: process.env.REACT_APP_KEYCLOAK_REALM || 'library-realm',
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'library-frontend',
};

function App() {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kc = new Keycloak(keycloakConfig);
    
    kc.init({ 
      onLoad: 'check-sso',
      checkLoginIframe: false, // Disable iframe to avoid CSP issues
      pkceMethod: 'S256'
    })
    .then((auth) => {
      setKeycloak(kc);
      setAuthenticated(auth);
      setLoading(false);
      
      if (auth) {
        console.log('✅ Authenticated as:', kc.tokenParsed?.preferred_username);
        console.log('Roles:', kc.tokenParsed?.realm_access?.roles);
        
        // Token refresh
        setInterval(() => {
          kc.updateToken(70).then((refreshed) => {
            if (refreshed) {
              console.log('🔄 Token refreshed');
            }
          }).catch(() => {
            console.error('❌ Failed to refresh token');
            setAuthenticated(false);
          });
        }, 60000); // Check every 60 seconds
      }
    })
    .catch((error) => {
      console.error('❌ Keycloak init failed:', error);
      setLoading(false);
    });

    return () => {
      if (kc) {
        kc.clearToken();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {authenticated ? (
          <Layout keycloak={keycloak}>
            <Routes>
              <Route path="/" element={<Home keycloak={keycloak} />} />
              <Route path="/books" element={<Books keycloak={keycloak} />} />
              <Route path="/loans" element={<Loans keycloak={keycloak} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="*" element={<Login keycloak={keycloak} />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
