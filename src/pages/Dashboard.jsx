import React, { useContext, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Fab, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SpaIcon from '@mui/icons-material/Spa';
import { CustomerContext } from '../context/CustomerContext';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { customers, getRecentVisits, loading } = useContext(CustomerContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const recentVisits = getRecentVisits(5);

  // Calculate this month's revenue roughly
  const currentMonth = new Date().getMonth();
  const thisMonthRevenue = customers.reduce((acc, customer) => {
    const monthVisits = (customer.servicesHistory || []).filter(v => new Date(v.date).getMonth() === currentMonth);
    return acc + monthVisits.reduce((sum, v) => sum + Number(v.price || 0), 0);
  }, 0);

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Welcome back,
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Card sx={{ bgcolor: '#5c4025', color: 'primary.contrastText', height: '100%' }}>
            <CardContent>
              <PeopleOutlineIcon sx={{ opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 0.5 }}>{customers.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Clients</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ bgcolor: '#4b3a3a', color: 'secondary.contrastText', height: '100%' }}>
            <CardContent>
              <SpaIcon sx={{ opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 0.5 }}>₹{thisMonthRevenue}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Recent Visits
        <Button size="small" onClick={() => navigate('/customers')} sx={{ color: 'text.secondary' }}>View All</Button>
      </Typography>

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
                  button
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
                  <Typography variant="body2" fontWeight="bold" color="secondary.main">
                    ₹{visit.amount}
                  </Typography>
                </ListItem>
                {index < recentVisits.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      <Fab
        color="primary"
        aria-label="add customer"
        onClick={() => setIsAddModalOpen(true)}
        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: '0 8px 16px rgba(212,163,115,0.4)' }}
      >
        <AddIcon />
      </Fab>

      <AddCustomerModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </Box>
  );
};

export default Dashboard;

