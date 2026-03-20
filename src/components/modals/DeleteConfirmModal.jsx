import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs" 
      PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
    >
      <Box sx={{ textAlign: 'center', pt: 2 }}>
        <WarningAmberIcon sx={{ color: 'error.main', fontSize: 48, mb: 1, opacity: 0.8 }} />
      </Box>
      <DialogTitle sx={{ textAlign: 'center', pt: 1, fontWeight: 700 }}>
        {title || 'Confirm Deletion'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" textAlign="center" color="text.secondary">
          {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ minWidth: 100, borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disableElevation sx={{ minWidth: 100, borderRadius: 2 }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
