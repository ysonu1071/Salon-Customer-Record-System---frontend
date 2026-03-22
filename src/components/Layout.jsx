import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Snackbar, Alert, Button } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import ProfileModal from './modals/ProfileModal';
import { CustomerContext } from '../context/CustomerContext';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleMenuClose();
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/customers') return 'Customers';
    if (location.pathname === '/appointments') return 'Appointments';
    if (location.pathname === '/monthly-revenue') return 'Monthly Revenue';
    if (location.pathname === '/pending-payments') return 'Pending Payments';
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
                {/* <Button color="inherit" onClick={() => navigate('/customers')} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                  All Customers
                </Button> */}
                <IconButton color="inherit" onClick={handleMenuOpen} sx={{ color: 'text.secondary' }}>
                  <MenuIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 1, mt: 1, minWidth: 150 }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={500}>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={500}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />

      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 3, px: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
