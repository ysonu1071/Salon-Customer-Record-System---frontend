import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Divider,
  Stack,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlineIcon from '@mui/icons-material/EmailOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../../context/AuthContext';

const ProfileModal = ({ open, onClose, user }) => {
  const { updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    salonName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        salonName: user.salonName || '',
        email: user.email || '',
      });
    }
  }, [user, open]);

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    const success = await updateProfile(formData);
    setLoading(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      salonName: user.salonName,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          p: 0,
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        <Box sx={{ p: 3, position: 'relative', textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>

          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'white',
              color: 'primary.main',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          {!isEditing ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
            </>
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit Profile
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 4 }}>
          <Stack spacing={3}>
            {isEditing ? (
              <>
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="standard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    startAdornment: <PersonOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <TextField
                  label="Salon Name"
                  fullWidth
                  variant="standard"
                  value={formData.salonName}
                  onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                  InputProps={{
                    startAdornment: <StorefrontIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  variant="standard"
                  value={formData.email}
                  disabled
                  InputProps={{
                    startAdornment: <EmailOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ borderRadius: 2, py: 1 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ borderRadius: 2, py: 1 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(212,163,115,0.1)', color: 'secondary.main' }}>
                    <StorefrontIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Salon Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.salonName || 'Not Set'}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(212,163,115,0.1)', color: 'secondary.main' }}>
                    <EmailOutlineIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2, borderRadius: 2, py: 1.2, fontWeight: 600 }}
                >
                  Edit Details
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClose}
                  sx={{ borderRadius: 2, py: 1, fontWeight: 600 }}
                >
                  Close
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
