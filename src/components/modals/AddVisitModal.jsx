import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import { CustomerContext } from '../../context/CustomerContext';

const AddVisitModal = ({ open, onClose, customerId }) => {
  const { addVisit } = useContext(CustomerContext);
  const [service, setService] = useState('');
  const [totalBill, setTotalBill] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  // Format today's date to YYYY-MM-DD for the date picker default
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!service.trim() || !date) return;

    setLoading(true);
    const success = await addVisit(customerId, {
      service,
      amount: 0, // Keep for backward compatibility, but not used in UI
      totalBill: parseFloat(totalBill) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
      date: new Date(date).toISOString(),
    });
    setLoading(false);

    if (success) {
      setService('');
      setTotalBill('');
      setAmountPaid('');
      setDate(today);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
        Record New Visit
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            size='small'
            autoFocus
            label="Service Description"
            variant="outlined"
            fullWidth
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g. Haircut & Color"
          />
          <TextField
            size='small'
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
            size='small'
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
            size='small'
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Visit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVisitModal;
