import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import { CustomerContext } from '../../context/CustomerContext';

const EditVisitModal = ({ open, onClose, customerId, visit }) => {
  const { updateVisit } = useContext(CustomerContext);
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visit) {
      setService(visit.service || '');
      setAmount(visit.price || '');
      // Format date for the input field (YYYY-MM-DD)
      if (visit.date) {
        setDate(new Date(visit.date).toISOString().split('T')[0]);
      }
    }
  }, [visit]);

  const handleSave = async () => {
    if (!service.trim() || !amount.toString().trim() || !date) return;

    setLoading(true);
    const success = await updateVisit(customerId, visit._id, {
      service,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
    });
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
        Edit Visit
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Service Description"
            variant="outlined"
            fullWidth
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
          <TextField
            label="Amount Spent"
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box> }}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="secondary" disableElevation disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Visit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVisitModal;
