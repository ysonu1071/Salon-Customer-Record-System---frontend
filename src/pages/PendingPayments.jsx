import React, { useContext, useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider, Button, ButtonGroup, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningIcon from '@mui/icons-material/Warning';
import DateRangeIcon from '@mui/icons-material/DateRange';

const PendingPayments = () => {
  const { customers } = useContext(CustomerContext);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'current-month', 'last-month'

  const pendingData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const allPendingVisits = customers.flatMap(customer =>
      (customer.servicesHistory || [])
        .filter(visit => {
          const visitDate = new Date(visit.date);
          const pendingAmount = (visit.totalBill || 0) - (visit.amountPaid || 0);

          // Only include visits with pending amounts
          if (pendingAmount <= 0) return false;

          // Apply filter
          if (filterType === 'current-month') {
            return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
          } else if (filterType === 'last-month') {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return visitDate.getMonth() === lastMonth && visitDate.getFullYear() === lastMonthYear;
          }

          return true; // 'all' filter
        })
        .map(visit => ({
          ...visit,
          customerName: customer.name,
          customerId: customer._id || customer.id,
          totalBill: visit.totalBill || 0,
          amountPaid: visit.amountPaid || 0,
          pendingAmount: (visit.totalBill || 0) - (visit.amountPaid || 0),
          daysSinceVisit: Math.floor((currentDate - new Date(visit.date)) / (1000 * 60 * 60 * 24))
        }))
    );

    const totalPending = allPendingVisits.reduce((sum, visit) => sum + visit.pendingAmount, 0);
    const totalBilled = allPendingVisits.reduce((sum, visit) => sum + visit.totalBill, 0);
    const totalCollected = allPendingVisits.reduce((sum, visit) => sum + visit.amountPaid, 0);

    // Sort by days since visit (oldest first for follow-up priority)
    const sortedVisits = allPendingVisits.sort((a, b) => b.daysSinceVisit - a.daysSinceVisit);

    return {
      totalPending,
      totalBilled,
      totalCollected,
      visits: sortedVisits,
      overdueCount: sortedVisits.filter(v => v.daysSinceVisit > 30).length
    };
  }, [customers, filterType]);

  const getFilterLabel = () => {
    switch (filterType) {
      case 'current-month':
        return format(new Date(), 'MMMM yyyy');
      case 'last-month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return format(lastMonth, 'MMMM yyyy');
      default:
        return 'All Time';
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection:{xs:'column', sm:'row'}, gap: 2, alignItems: 'center', mb: 3 }}>
        {/* <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton> */}
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', flexGrow: 1 }}>
          Pending Payments - {getFilterLabel()}
        </Typography>
        <Button
          variant="contained"
          startIcon={<DateRangeIcon />}
          onClick={() => navigate('/monthly-revenue')}
          sx={{ ml: 2 }}
        >
          Monthly Revenue
        </Button>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={filterType === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilterType('all')}
          >
            All Time
          </Button>
          <Button
            variant={filterType === 'current-month' ? 'contained' : 'outlined'}
            onClick={() => setFilterType('current-month')}
          >
            This Month
          </Button>
          <Button
            variant={filterType === 'last-month' ? 'contained' : 'outlined'}
            onClick={() => setFilterType('last-month')}
          >
            Last Month
          </Button>
        </ButtonGroup>

        {pendingData.overdueCount > 0 && (
          <Chip
            icon={<WarningIcon />}
            label={`${pendingData.overdueCount} overdue (>30 days)`}
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#d32f2f', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <AccountBalanceIcon sx={{ opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{pendingData.totalPending.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#512DA8', color: 'primary.contrastText' }}>
            <CardContent sx={{ p: 3 }}>
              <TrendingUpIcon sx={{ opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{pendingData.totalBilled.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Billed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#2e7d32', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <AccountBalanceIcon sx={{ opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                ₹{pendingData.totalCollected.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Amount Collected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Pending Payments ({pendingData.visits.length})
      </Typography>

      <Card>
        {pendingData.visits.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No pending payments {filterType === 'all' ? 'found' : `for ${getFilterLabel().toLowerCase()}`}</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {pendingData.visits.map((visit, index) => (
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          {visit.customerName}
                        </Typography>
                        {visit.daysSinceVisit > 30 && (
                          <Chip label="Overdue" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {visit.service} • {format(new Date(visit.date), 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visit.daysSinceVisit} days ago
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Chip
                      label={`₹${visit.pendingAmount.toLocaleString()} pending`}
                      size="small"
                      color={visit.daysSinceVisit > 30 ? 'error' : 'warning'}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Bill: ₹{visit.totalBill.toLocaleString()} • Paid: ₹{visit.amountPaid.toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
                {index < pendingData.visits.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
};

export default PendingPayments;