import React, { useContext } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Button,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { CustomerContext } from '../../context/CustomerContext';
import { format } from 'date-fns';

const AppointmentsListModal = ({ open, onClose }) => {
  const { appointments, updateAppointmentStatus, removeAppointment } = useContext(CustomerContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 550 },
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    p: 4,
    overflowY: 'auto',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Appointments List
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {appointments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No appointments found.</Typography>
          </Box>
        ) : (
          <List>
            {appointments.map((appointment, index) => (
              <React.Fragment key={appointment._id}>
                <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                  <ListItemText
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {appointment.customerName}
                        </Typography>
                        <Chip 
                          label={appointment.status.toUpperCase()} 
                          size="small" 
                          color={getStatusColor(appointment.status)}
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', mb: 0.5 }}>
                          Service: {appointment.service}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {format(new Date(appointment.date), 'EEE, MMM d, yyyy')} at {appointment.time}
                        </Typography>
                        {appointment.phone && (
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Phone: {appointment.phone}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      {appointment.status === 'pending' && (
                        <IconButton 
                          edge="end" 
                          title="Confirm"
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      <IconButton 
                        edge="end" 
                        title="Cancel/Delete"
                        onClick={() => removeAppointment(appointment._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < appointments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AppointmentsListModal;
