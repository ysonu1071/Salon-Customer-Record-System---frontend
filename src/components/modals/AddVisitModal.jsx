import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { CustomerContext } from '../../context/CustomerContext';

const AddVisitModal = ({ open, onClose, customerId }) => {
  const { addVisit } = useContext(CustomerContext);
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');

  // Format today's date to YYYY-MM-DD for the date picker default
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleSave = async () => {
    if (!service.trim() || !amount.trim() || !date) return;

    const success = await addVisit(customerId, {
      service,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
    });

    if (success) {
      setService('');
      setAmount('');
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
            autoFocus
            label="Service Description"
            variant="outlined"
            fullWidth
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g. Haircut & Color"
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
        <Button onClick={handleSave} variant="contained" color="secondary" disableElevation>
          Save Visit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVisitModal;
