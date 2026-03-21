import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, IconButton, CircularProgress, Menu, MenuItem, ListItemIcon } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomerContext } from '../context/CustomerContext';
import AddVisitModal from '../components/modals/AddVisitModal';
import EditCustomerModal from '../components/modals/EditCustomerModal';
import EditVisitModal from '../components/modals/EditVisitModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import AddAppointmentModal from '../components/modals/AddAppointmentModal';
import { format } from 'date-fns';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomer, loading, deleteCustomer, deleteVisit } = useContext(CustomerContext);

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isEditVisitOpen, setIsEditVisitOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ type: '', title: '', message: '', id: null });
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Menu states
  const [customerMenuAnchor, setCustomerMenuAnchor] = useState(null);
  const [visitMenuAnchor, setVisitMenuAnchor] = useState(null);
  const [activeVisitId, setActiveVisitId] = useState(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const customer = getCustomer(id);

  if (!customer) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Customer not found.</Typography>;
  }

  const visits = customer.servicesHistory || [];
  const lastVisit = visits.length > 0
    ? new Date(Math.max(...visits.map(v => new Date(v.date))))
    : null;

  const totalSpent = visits.reduce((sum, v) => sum + (v.price || 0), 0);

  const handleWhatsApp = () => {
    const formattedPhone = customer.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${customer.name}, it's been a while since your last visit. Would you like to book an appointment?`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  const handleDeleteCustomer = () => {
    setDeleteConfig({
      type: 'customer',
      title: 'Delete Customer?',
      message: 'Are you sure you want to delete this customer? All their history will be permanently removed.',
      id: customer._id
    });
    setIsDeleteConfirmOpen(true);
    setCustomerMenuAnchor(null);
  };

  const handleDeleteVisit = (visitId) => {
    setDeleteConfig({
      type: 'visit',
      title: 'Delete Visit?',
      message: 'Are you sure you want to remove this visit record?',
      id: visitId
    });
    setIsDeleteConfirmOpen(true);
    setVisitMenuAnchor(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    if (deleteConfig.type === 'customer') {
      const success = await deleteCustomer(deleteConfig.id);
      setIsDeleting(false);
      if (success) navigate('/customers');
    } else if (deleteConfig.type === 'visit') {
      await deleteVisit(customer._id, deleteConfig.id);
      setIsDeleting(false);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setIsEditVisitOpen(true);
    setVisitMenuAnchor(null);
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ position: 'relative', mb: 4, textAlign: 'center' }}>
        <IconButton
          sx={{ position: 'absolute', right: 0, top: 0 }}
          onClick={(e) => setCustomerMenuAnchor(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={customerMenuAnchor}
          open={Boolean(customerMenuAnchor)}
          onClose={() => setCustomerMenuAnchor(null)}
        >
          <MenuItem onClick={() => { setIsEditCustomerOpen(true); setCustomerMenuAnchor(null); }}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            Edit Customer
          </MenuItem>
          <MenuItem onClick={handleDeleteCustomer} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
            Delete Customer
          </MenuItem>
        </Menu>

        <Box
          sx={{
            width: 80, height: 80,
            bgcolor: 'primary.light', color: 'primary.contrastText',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', margin: '0 auto', mb: 2
          }}
        >
          {customer.name.charAt(0)}
        </Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>{customer.name}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {customer.phone}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', height: '100%', bgcolor: '#FAF8F5' }} elevation={0}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h5" color="primary.dark" fontWeight="bold">{visits.length}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>Visits</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', height: '100%', bgcolor: '#FAF8F5' }} elevation={0}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h5" color="primary.dark" fontWeight="bold">₹{totalSpent}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>Spent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', height: '100%', bgcolor: '#FAF8F5' }} elevation={0}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body1" color="primary.dark" fontWeight="bold" sx={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lastVisit ? format(lastVisit, 'MMM d, yyyy') : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>Last Visit</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setIsVisitModalOpen(true)}
        >
          Add Visit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<CalendarMonthIcon />}
          onClick={() => setIsAppointmentModalOpen(true)}
        >
          Book Appointment
        </Button>
        <Button
          variant="outlined"
          color="success"
          sx={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.5)', '&:hover': { bgcolor: 'rgba(37,211,102,0.05)', borderColor: '#25D366' } }}
          fullWidth
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsApp}
        >
          Message
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Visit History</Typography>

      <Card>
        {visits.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No visits recorded yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {[...visits].sort((a, b) => new Date(b.date) - new Date(a.date)).map((visit, index) => (
              <React.Fragment key={visit._id || index}>
                <ListItem
                  sx={{ py: 2 }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="options" onClick={(e) => {
                      setVisitMenuAnchor(e.currentTarget);
                      setActiveVisitId(visit._id);
                      setSelectedVisit(visit);
                    }}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
                    <Typography variant="button" sx={{ lineHeight: 1 }}>{format(new Date(visit.date), 'MMMM')}</Typography>
                    <Typography variant="h6" color="text.primary" sx={{ lineHeight: 1.2 }}>{format(new Date(visit.date), 'd, yyyy')}</Typography>
                  </Box>
                  <ListItemText
                    primary={visit.service}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Typography fontWeight="bold" color="secondary.main" sx={{ mr: 2 }}>
                    ₹{visit.price}
                  </Typography>
                </ListItem>
                {index < visits.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      {/* Visit Options Menu */}
      <Menu
        anchorEl={visitMenuAnchor}
        open={Boolean(visitMenuAnchor)}
        onClose={() => setVisitMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleEditVisit(selectedVisit)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Visit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteVisit(activeVisitId)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Delete Visit
        </MenuItem>
      </Menu>

      <AddVisitModal
        open={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        customerId={customer._id}
      />

      <AddAppointmentModal
        open={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        initialCustomer={customer}
      />

      <EditCustomerModal
        open={isEditCustomerOpen}
        onClose={() => setIsEditCustomerOpen(false)}
        customer={customer}
      />

      <EditVisitModal
        open={isEditVisitOpen}
        onClose={() => setIsEditVisitOpen(false)}
        customerId={customer._id}
        visit={selectedVisit}
      />

      <DeleteConfirmModal
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteConfig.title}
        message={deleteConfig.message}
        loading={isDeleting}
      />
    </Box>
  );
};

export default CustomerDetail;

