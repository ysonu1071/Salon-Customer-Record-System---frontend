import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
          Salon MVP
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to manage your clients
        </Typography>
        
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            disableElevation
            sx={{ mt: 1, py: 1.5, borderRadius: 2 }}
          >
            Log In
          </Button>
        </Box>
        
        <Typography align="center" variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register" sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'none' }}>
            Register here
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
