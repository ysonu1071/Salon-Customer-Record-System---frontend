import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Snackbar, Alert, Button } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import LogoutIcon from '@mui/icons-material/Logout';
import { CustomerContext } from '../context/CustomerContext';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/customers') return 'Customers';
    if (location.pathname.startsWith('/customer/')) return 'Customer Details';
    return 'Salon MVP';
  };

  const showBackButton = location.pathname !== '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters sx={{ px: 2, height: 64 }}>
            {showBackButton ? (
              <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <ContentCutIcon sx={{ color: 'primary.main', mr: 2 }} />
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>

            {location.pathname === '/' && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button color="inherit" onClick={() => navigate('/customers')} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                  All Customers
                </Button>
                <IconButton color="inherit" onClick={logout} sx={{ color: 'text.secondary' }}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 3, px: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
