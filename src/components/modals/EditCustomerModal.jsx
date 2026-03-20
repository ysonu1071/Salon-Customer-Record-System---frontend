import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import { CustomerContext } from '../../context/CustomerContext';

const EditCustomerModal = ({ open, onClose, customer }) => {
  const { updateCustomer } = useContext(CustomerContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
    }
  }, [customer]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    const success = await updateCustomer(customer._id || customer.id, { name, phone });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
        Edit Customer
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Full Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disableElevation disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerModal;
