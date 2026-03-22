import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Stack,
  Fab,
  Tabs,
  Tab,
  Card,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { CustomerContext } from '../context/CustomerContext';
import AddAppointmentModal from '../components/modals/AddAppointmentModal';
import { format } from 'date-fns';

const SERVICE_TYPE_COLORS = {
  Makeup: 'secondary',
  Service: 'primary',
  Mehandi: 'success',
  'Nail Extension': 'warning',
};

const Appointments = () => {
  const { appointments, updateAppointmentStatus, removeAppointment, loading } = useContext(CustomerContext);
  const [tab, setTab] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const tabFilters = ['all', 'Makeup', 'Service', 'Mehandi', 'Nail Extension'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const filtered = tab === 0
    ? appointments
    : appointments.filter(a => a.serviceType === tabFilters[tab]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h5" fontWeight="bold">Appointments</Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'capitalize', fontWeight: 600 } }}
      >
        <Tab label={`All (${appointments.length})`} />
        <Tab label={`Makeup (${appointments.filter(a => a.serviceType === 'Makeup').length})`} />
        <Tab label={`Service (${appointments.filter(a => a.serviceType === 'Service').length})`} />
        <Tab label={`Mehandi (${appointments.filter(a => a.serviceType === 'Mehandi').length})`} />
        <Tab label={`Nail Extension (${appointments.filter(a => a.serviceType === 'Nail Extension').length})`} />
      </Tabs>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <CalendarMonthIcon sx={{ fontSize: 40, mb: 1.5, opacity: 0.3 }} />
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>No appointments here</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Use the + button to book a new appointment.</Typography>
        </Box>
      ) : (
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <List disablePadding>
            {filtered.map((appointment, index) => (
              <React.Fragment key={appointment._id}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5, pr: 12 }}>
                  <ListItemText
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.25 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.95rem' }}>
                          {appointment.customerName}
                        </Typography>
                        <Chip
                          label={appointment.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(appointment.status)}
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', fontWeight: 'bold', height: 18, px: 0.75 }}
                        />
                        {appointment.serviceType && (
                          <Chip
                            label={appointment.serviceType}
                            size="small"
                            color={SERVICE_TYPE_COLORS[appointment.serviceType] || 'default'}
                            sx={{ fontSize: '0.6rem', height: 18, px: 0.75 }}
                          />
                        )}
                        <Chip
                          label={appointment.appointmentType === 'salon' ? '🏪 SALON' : '🏠 OUTSIDE'}
                          size="small"
                          color={appointment.appointmentType === 'salon' ? 'info' : 'warning'}
                          sx={{ fontSize: '0.6rem', height: 20 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                          {appointment.service}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {format(new Date(appointment.date), 'EEE, MMM d, yyyy')} at {appointment.time}
                        </Typography>
                        {appointment.phone && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                            📞 {appointment.phone}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {appointment.appointmentType === 'salon' ? '🏪 Salon' : '🏠 Outside'}
                          {appointment.appointmentType === 'outside' && appointment.location && (
                            <span> - {appointment.location}</span>
                          )}
                        </Typography>
                        {(appointment.priceDiscussed || appointment.advanceTaken) ? (
                          <Box sx={{ mt: 0.75, pt: 0.75, borderTop: '1px solid #e0e0e0' }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                              💰 Price: ₹{Number(appointment.priceDiscussed || 0).toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                              ✓ Advance: ₹{Number(appointment.advanceTaken || 0).toFixed(2)}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              display="block"
                              sx={{ 
                                fontWeight: 600,
                                color: appointment.priceDiscussed - appointment.advanceTaken > 0 ? '#f57c00' : '#4caf50',
                                fontSize: '0.75rem',
                                lineHeight: 1.3
                              }}
                            >
                              Remaining: ₹{(Number(appointment.priceDiscussed || 0) - Number(appointment.advanceTaken || 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75, fontSize: '0.75rem' }}>
                            No price discussed yet
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={0.25}>
                      {appointment.status === 'pending' && (
                        <IconButton
                          size="small"
                          title="Confirm"
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          color="success"
                          sx={{ p: 0.5 }}
                        >
                          <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      )}
                      {appointment.status === 'confirmed' && (
                        <IconButton
                          size="small"
                          title="Mark Completed"
                          onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                          color="info"
                          sx={{ p: 0.5 }}
                        >
                          <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        title="Delete"
                        onClick={() => removeAppointment(appointment._id)}
                        color="error"
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filtered.length - 1 && <Divider component="li" sx={{ mx: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}

      <Fab
        color="primary"
        aria-label="book appointment"
        onClick={() => setIsAddOpen(true)}
        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: '0 8px 16px rgba(212,163,115,0.4)' }}
      >
        <AddIcon />
      </Fab>

      <AddAppointmentModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </Box>
  );
};

export default Appointments;
