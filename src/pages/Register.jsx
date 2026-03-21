import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password, salonName);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
          Create Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Join Salon MVP today
        </Typography>
        
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Salon Name"
            variant="outlined"
            fullWidth
            required
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
          />
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
            disabled={loading}
            sx={{ mt: 1, py: 1.5, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </Box>
        
        <Typography align="center" variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'none' }}>
            Log in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
