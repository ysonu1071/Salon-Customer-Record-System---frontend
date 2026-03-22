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
    priceDiscussed: '',
    advanceTaken: '',
    appointmentType: 'salon',
    location: '',
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
        priceDiscussed: '',
        advanceTaken: '',
        appointmentType: 'salon',
        location: '',
      });
    }
  }, [initialCustomer, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for outside appointments
    if (formData.appointmentType === 'outside' && !formData.location.trim()) {
      alert('Location is required for outside appointments');
      return;
    }
    
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
    width: { xs: '90%', sm: 420 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>
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
                size='small'
                label="Customer"
                value={formData.customerName}
                disabled
                fullWidth
              />
            ) : (
              <Autocomplete
                size='small'
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
                    size='small'
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
            <FormControl fullWidth required size="small">
              <InputLabel id="service-type-label">Service Type</InputLabel>
              <Select
                labelId="service-type-label"
                id="service-type-select"
                size="small"
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
              size='small'
              label="Service Description"
              fullWidth
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              placeholder="e.g. Bridal Makeup, French Tips, etc."
            />

            {/* Date & Time */}
            <Stack direction="row" spacing={2}>
              <TextField
                size='small'
                label="Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <TextField
                size='small'
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
              size='small'
              label="Phone (Optional)"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* Appointment Type */}
            <FormControl fullWidth>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                size='small'
                value={formData.appointmentType}
                label="Appointment Type"
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
              >
                <MenuItem value="salon">🏪 Salon</MenuItem>
                <MenuItem value="outside">🏠 Outside</MenuItem>
              </Select>
            </FormControl>

            {/* Location field - only show if appointment type is outside */}
            {formData.appointmentType === 'outside' && (
              <TextField
                size='small'
                label="Location"
                fullWidth
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Customer's home address, Hotel name, etc."
                helperText="Please provide the location details for outside appointment"
              />
            )}

            {/* Price Fields */}
            <Stack direction="row" spacing={2}>
              <TextField
                size='small'
                label="Price Discussed"
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.priceDiscussed}
                onChange={(e) => setFormData({ ...formData, priceDiscussed: e.target.value })}
                placeholder="0.00"
              />
              <TextField
                size='small'
                label="Advance Taken"
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.advanceTaken}
                onChange={(e) => setFormData({ ...formData, advanceTaken: e.target.value })}
                placeholder="0.00"
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{
                mt: 0.5,
                py: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '0.875rem'
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
