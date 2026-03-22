import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import { CustomerContext } from '../../context/CustomerContext';

const EditVisitModal = ({ open, onClose, customerId, visit }) => {
  const { updateVisit } = useContext(CustomerContext);
  const [service, setService] = useState('');
  const [totalBill, setTotalBill] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visit) {
      setService(visit.service || '');
      setTotalBill(visit.totalBill || '');
      setAmountPaid(visit.amountPaid || '');
      // Format date for the input field (YYYY-MM-DD)
      if (visit.date) {
        setDate(new Date(visit.date).toISOString().split('T')[0]);
      }
    }
  }, [visit]);

  const handleSave = async () => {
    if (!service.trim() || !date) return;

    setLoading(true);
    const success = await updateVisit(customerId, visit._id, {
      service,
      amount: 0, // Keep for backward compatibility, but not used in UI
      totalBill: parseFloat(totalBill) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
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
            label="Total Bill"
            variant="outlined"
            fullWidth
            type="number"
            value={totalBill}
            onChange={(e) => setTotalBill(e.target.value)}
            InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box> }}
            placeholder="0.00"
          />
          <TextField
            label="Amount Paid"
            variant="outlined"
            fullWidth
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box> }}
            placeholder="0.00"
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
