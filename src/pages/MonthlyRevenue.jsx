import React, { useContext, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const MonthlyRevenue = () => {
  const { customers } = useContext(CustomerContext);
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyData = useMemo(() => {
    const monthVisits = customers.flatMap(customer =>
      (customer.servicesHistory || [])
        .filter(visit => {
          const visitDate = new Date(visit.date);
          return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        })
        .map(visit => ({
          ...visit,
          customerName: customer.name,
          customerId: customer._id || customer.id,
          totalBill: visit.totalBill || 0,
          amountPaid: visit.amountPaid || 0,
          pendingAmount: (visit.totalBill || 0) - (visit.amountPaid || 0)
        }))
    );

    const totalBilled = monthVisits.reduce((sum, visit) => sum + visit.totalBill, 0);
    const totalCollected = monthVisits.reduce((sum, visit) => sum + visit.amountPaid, 0);
    const totalPending = monthVisits.reduce((sum, visit) => sum + visit.pendingAmount, 0);

    const visitsWithPending = monthVisits.filter(visit => visit.pendingAmount > 0);

    return {
      totalBilled,
      totalCollected,
      totalPending,
      visitsWithPending: visitsWithPending.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  }, [customers, currentMonth, currentYear]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection:{xs:'column', sm:'row'}, gap: 2, alignItems: 'center', mb: 3 }}>
        {/* <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton> */}
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', flexGrow: 1 }}>
          {format(new Date(currentYear, currentMonth), 'MMMM yyyy')} Revenue
        </Typography>
        <Button
          variant="contained"
          startIcon={<AccountBalanceIcon />}
          onClick={() => navigate('/pending-payments')}
          sx={{ ml: 2 }}
        >
          View All Pending
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#512DA8', color: 'primary.contrastText' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{monthlyData.totalBilled.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                This Month Bill
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#2e7d32', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{monthlyData.totalCollected.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Amount Collected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: monthlyData.totalPending > 0 ? '#d32f2f' : '#4caf50', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{monthlyData.totalPending.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Pending Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Visits with Pending Payments ({monthlyData.visitsWithPending.length})
      </Typography>

      <Card>
        {monthlyData.visitsWithPending.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No pending payments this month</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {monthlyData.visitsWithPending.map((visit, index) => (
              <React.Fragment key={visit._id || index}>
                <ListItem
                  sx={{ py: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/customer/${visit.customerId}`)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.default', color: 'primary.main', fontWeight: 'bold' }}>
                      {visit.customerName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={visit.customerName}
                    secondary={`${visit.service} • ${format(new Date(visit.date), 'MMM d, yyyy')}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Chip
                      label={`₹${visit.pendingAmount.toLocaleString()} pending`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Bill: ₹{visit.totalBill.toLocaleString()} • Paid: ₹{visit.amountPaid.toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
                {index < monthlyData.visitsWithPending.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
};

export default MonthlyRevenue;