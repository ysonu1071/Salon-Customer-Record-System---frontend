import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, Badge, Dialog, DialogTitle, DialogContent, IconButton, useTheme } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerContext } from '../context/CustomerContext';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

const DashboardReminders = ({ open, onClose }) => {
  const { reminders, fetchReminders, markAsContacted } = useContext(CustomerContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('followups');

  const downMd = useTheme((theme) => theme.breakpoints.down('md'))

  useEffect(() => {
    if (open) {
      fetchReminders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSendMessage = (customer, type) => {
    const formattedPhone = customer.phone.replace(/\D/g, '');
    let template = '';

    if (type === 'followup') {
      template = `Hi *${customer.name}*! 👋 This is *${user?.salonName}*. Thanks for visiting us for your *${customer.service}*! ✨ We hope you loved the results! We'd love to see you again soon. Have a great day! ❤️`;
    } else {
      template = `Hi *${customer.name}*! ❤️ We miss you at *${user?.salonName}*! ✨ It's been a month since your last pampering session. Ready for a refresh? Book your next appointment now and get that glow back! 💇‍♀️💅`;
    }

    const message = encodeURIComponent(template);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');

    // Mark as contacted so it disappears from the list
    markAsContacted(customer._id);
  };

  const followUps = reminders.followUps || [];
  const missed = reminders.missed || [];
  const totalCount = followUps.length + missed.length;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Reminders & Follow-ups</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pb: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip
            label={`Daily Follow-ups (${followUps.length})`}
            onClick={() => setActiveTab('followups')}
            color={activeTab === 'followups' ? 'primary' : 'default'}
            variant={activeTab === 'followups' ? 'contained' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`Missed Clients (${missed.length})`}
            onClick={() => setActiveTab('missed')}
            color={activeTab === 'missed' ? 'primary' : 'default'}
            variant={activeTab === 'missed' ? 'contained' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#fdfbf9' }}>
          <List disablePadding>
            {activeTab === 'followups' ? (
              followUps.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>No follow-ups for today!</Box>
              ) : (
                followUps.map((c, i) => (
                  <ListItem
                    key={c._id}
                    divider={i < followUps.length - 1}
                    secondaryAction={
                      downMd ? <IconButton size='small' color='success' onClick={() => handleSendMessage(c, 'followup')}><WhatsAppIcon /></IconButton> : <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleSendMessage(c, 'followup')}
                        sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
                      >
                        Message
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={c.name}
                      secondary={`Visited for ${c.service} • ${format(new Date(c.date), 'MMM d')}`}
                    />
                  </ListItem>
                ))
              )
            ) : (
              missed.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>No missed clients to show.</Box>
              ) : (
                missed.map((c, i) => (
                  <ListItem
                    key={c._id}
                    divider={i < missed.length - 1}
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleSendMessage(c, 'missed')}
                      >
                        Remind
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={c.name}
                      secondary={`Last seen ${c.daysAgo} days ago • ${format(new Date(c.date), 'MMM d')}`}
                    />
                  </ListItem>
                ))
              )
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardReminders;
