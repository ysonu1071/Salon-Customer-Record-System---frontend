import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Fab, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SpaIcon from '@mui/icons-material/Spa';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CustomerContext } from '../context/CustomerContext';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import AddAppointmentModal from '../components/modals/AddAppointmentModal';
import AppointmentsListModal from '../components/modals/AppointmentsListModal';
import DashboardReminders from '../components/DashboardReminders';
import { AuthContext } from '../context/AuthContext';
import { format, isSameDay } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { customers, getRecentVisits, reminders, fetchReminders, loading, appointments } = useContext(CustomerContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isAppointmentsListOpen, setIsAppointmentsListOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const recentVisits = getRecentVisits(5);
  const totalReminders = (reminders?.followUps?.length || 0) + (reminders?.missed?.length || 0);

  // Calculate this month's revenue roughly
  const currentMonth = new Date().getMonth();
  const thisMonthRevenue = customers.reduce((acc, customer) => {
    const monthVisits = (customer.servicesHistory || []).filter(v => new Date(v.date).getMonth() === currentMonth);
    return acc + monthVisits.reduce((sum, v) => sum + Number(v.price || 0), 0);
  }, 0);

  const handleFollowUp = (visit) => {
    // Find the customer to get their phone number
    const customer = customers.find(c => c._id === visit.customerId);
    if (!customer) return;

    const formattedPhone = customer.phone.replace(/\D/g, '');
    const template = `Hi *${customer.name}*! 👋 This is *Salon MVP*. Thanks for visiting us for your *${visit.service}*! ✨ We hope you loved the results! We'd love to see you again soon. Have a great day! ❤️`;
    const message = encodeURIComponent(template);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 'bold' }}>
        Welcome back,
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={3}>
          <Card sx={{ bgcolor: '#512DA8', color: 'primary.contrastText', height: '100%', cursor: 'pointer', '&:hover': { opacity: 0.9 } }} onClick={() => setIsAppointmentsListOpen(true)}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <CalendarTodayIcon sx={{ opacity: 0.8, mb: 1 }} fontSize="small" />
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                {appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>Appointments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card onClick={() => navigate('/customers')} sx={{ bgcolor: '#5c4025', color: 'primary.contrastText', height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <PeopleOutlineIcon sx={{ opacity: 0.8, mb: 1 }} fontSize="small" />
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 'bold' }}>{customers.length}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>Total Clients</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card
            sx={{ bgcolor: '#2e7d32', color: '#fff', height: '100%', cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
            onClick={() => setIsRemindersOpen(true)}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <WhatsAppIcon sx={{ opacity: 0.8, mb: 1 }} fontSize="small" />
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 'bold' }}>{totalReminders}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>Follow-ups</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ bgcolor: '#4b3a3a', color: 'secondary.contrastText', height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <SpaIcon sx={{ opacity: 0.8, mb: 1 }} fontSize="small" />
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 'bold' }}>₹{thisMonthRevenue}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DashboardReminders open={isRemindersOpen} onClose={() => setIsRemindersOpen(false)} />

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Recent Visits</Typography>
        <Button size="small" onClick={() => navigate('/customers')} sx={{ color: 'text.secondary', textTransform: 'none' }}>View All</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        {recentVisits.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No recent visits</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recentVisits.map((visit, index) => (
              <React.Fragment key={visit._id || index}>
                <ListItem
                  disablePadding
                  divider={index < recentVisits.length - 1}
                >
                  <ListItemButton
                    onClick={() => navigate(`/customer/${visit.customerId}`)}
                    sx={{ py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.default', color: 'primary.main', fontWeight: 'bold' }}>
                        {visit.customerName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={visit.customerName}
                      secondary={`${visit.service} • ${format(new Date(visit.date), 'MMM d')}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                      <Typography variant="body2" fontWeight="bold" color="secondary.main" component="span">
                        ₹{visit.amount}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      <Fab
        color="primary"
        aria-label="add options"
        onClick={(e) => setAddMenuAnchor(e.currentTarget)}
        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: '0 8px 16px rgba(212,163,115,0.4)' }}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180, mt: -1 }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { setIsAddModalOpen(true); setAddMenuAnchor(null); }}>
          <ListItemIcon><PeopleOutlineIcon fontSize="small" /></ListItemIcon>
          Add Customer
        </MenuItem>
        <MenuItem onClick={() => { setIsAddAppointmentOpen(true); setAddMenuAnchor(null); }}>
          <ListItemIcon><EventAvailableIcon fontSize="small" /></ListItemIcon>
          Book Appointment
        </MenuItem>
      </Menu>

      <AddCustomerModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <AddAppointmentModal open={isAddAppointmentOpen} onClose={() => setIsAddAppointmentOpen(false)} />
      <AppointmentsListModal open={isAppointmentsListOpen} onClose={() => setIsAppointmentsListOpen(false)} />
    </Box>
  );
};

export default Dashboard;

