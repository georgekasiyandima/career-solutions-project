import React, { useState } from 'react';
import { Box, Avatar, Typography, Paper, Button, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

// Use authenticated user data from context

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const handleAdminMenuOpen = (event) => setAdminMenuAnchor(event.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchor(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320, maxWidth: 400, textAlign: 'center' }}>
        <Avatar
          src={authUser?.avatarUrl || ''}
          alt={authUser?.name || 'User'}
          sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#1976d2', fontSize: 32 }}
        >
          {(authUser?.name || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {authUser?.name || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {authUser?.email || 'No email available'}
        </Typography>
        {authUser?.role === 'admin' && (
          <>
            <Button
              color="inherit"
              onClick={handleAdminMenuOpen}
              sx={{ fontWeight: 600, fontFamily: 'Poppins, Inter, Arial, sans-serif', textTransform: 'none' }}
            >
              Admin
            </Button>
            <Menu
              anchorEl={adminMenuAnchor}
              open={Boolean(adminMenuAnchor)}
              onClose={handleAdminMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem component={NavLink} to="/admin" onClick={handleAdminMenuClose}>Dashboard</MenuItem>
              <MenuItem component={NavLink} to="/admin/analytics" onClick={handleAdminMenuClose}>Analytics</MenuItem>
              <MenuItem component={NavLink} to="/admin/users" onClick={handleAdminMenuClose}>User Management</MenuItem>
              <MenuItem component={NavLink} to="/admin/content" onClick={handleAdminMenuClose}>Content Manager</MenuItem>
              {/* Add more as needed */}
            </Menu>
          </>
        )}
        <Button variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile; 