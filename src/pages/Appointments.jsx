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
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <CalendarMonthIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" gutterBottom>No appointments here</Typography>
          <Typography variant="body2">Use the + button to book a new appointment.</Typography>
        </Box>
      ) : (
        <Card>
          <List disablePadding>
            {filtered.map((appointment, index) => (
              <React.Fragment key={appointment._id}>
                <ListItem alignItems="flex-start" sx={{ py: 2, pr: 14 }}>
                  <ListItemText
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {appointment.customerName}
                        </Typography>
                        <Chip
                          label={appointment.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(appointment.status)}
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', fontWeight: 'bold', height: 20 }}
                        />
                        {appointment.serviceType && (
                          <Chip
                            label={appointment.serviceType}
                            size="small"
                            color={SERVICE_TYPE_COLORS[appointment.serviceType] || 'default'}
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          {appointment.service}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {format(new Date(appointment.date), 'EEE, MMM d, yyyy')} at {appointment.time}
                        </Typography>
                        {appointment.phone && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            📞 {appointment.phone}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={0.5}>
                      {appointment.status === 'pending' && (
                        <IconButton
                          size="small"
                          title="Confirm"
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          color="success"
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      {appointment.status === 'confirmed' && (
                        <IconButton
                          size="small"
                          title="Mark Completed"
                          onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                          color="info"
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        title="Delete"
                        onClick={() => removeAppointment(appointment._id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filtered.length - 1 && <Divider component="li" />}
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
