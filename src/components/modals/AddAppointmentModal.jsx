import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerContext } from '../../context/CustomerContext';

const SERVICE_TYPES = ['Makeup', 'Service', 'Mehandi', 'Nail Extension'];

const AddAppointmentModal = ({ open, onClose, initialCustomer = null }) => {
  const { customers, addAppointment } = useContext(CustomerContext);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    serviceType: '',
    service: '',
    date: '',
    time: '',
    phone: '',
  });

  useEffect(() => {
    if (initialCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: initialCustomer._id || initialCustomer.id,
        customerName: initialCustomer.name,
        phone: initialCustomer.phone || '',
      }));
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        serviceType: '',
        service: '',
        date: '',
        time: '',
        phone: '',
      });
    }
  }, [initialCustomer, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addAppointment(formData);
    if (success) {
      onClose();
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 480 },
    maxHeight: '95vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Book Appointment
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Customer field */}
            {initialCustomer ? (
              <TextField
                label="Customer"
                value={formData.customerName}
                disabled
                fullWidth
              />
            ) : (
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.name + (option.phone ? ` (${option.phone})` : '')}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    customerId: newValue?._id || '',
                    customerName: newValue?.name || '',
                    phone: newValue?.phone || '',
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    required
                    helperText="Search by name or phone"
                  />
                )}
                freeSolo
                onInputChange={(event, newInputValue) => {
                  if (!customers.find(c => c.name === newInputValue)) {
                    setFormData({ ...formData, customerName: newInputValue, customerId: '' });
                  }
                }}
              />
            )}

            {/* Service Type Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.serviceType}
                label="Service Type"
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                {SERVICE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Service description */}
            <TextField
              label="Service Description"
              fullWidth
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              placeholder="e.g. Bridal Makeup, French Tips, etc."
            />

            {/* Date & Time */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <TextField
                label="Time"
                type="time"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </Stack>

            <TextField
              label="Phone (Optional)"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Confirm Appointment
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default AddAppointmentModal;
