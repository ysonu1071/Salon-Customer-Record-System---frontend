import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';

const CustomerList = () => {
  const { customers, loading } = useContext(CustomerContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search by name or phone..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, bgcolor: '#FFFFFF', borderRadius: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: { borderRadius: 3 }
        }}
      />

      {filteredCustomers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No customers found.</Typography>
        </Box>
      ) : (
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredCustomers.map(customer => (
            <Paper key={customer._id} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)' }}>
              <ListItem
                button
                onClick={() => navigate(`/customer/${customer._id}`)}
                sx={{ py: 2, px: 2 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                    {customer.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={customer.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, opacity: 0.8 }}>
                      <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {customer.phone}
                    </Box>
                  }
                  primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CustomerList;
