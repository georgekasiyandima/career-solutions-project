import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Badge, 
  Tooltip, 
  Divider, 
  Avatar, 
  ListItemAvatar, 
  Typography,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../services/notificationService';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatDistanceToNow } from 'date-fns';
// import websocketService from '../../services/websocketService';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import FocusTrap from 'focus-trap-react';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAdminMenuAnchor(null);
    navigate('/');
  };

  const userRole = user ? user.role : null;

  // Admin menu handlers
  const handleAdminMenuOpen = (event) => setAdminMenuAnchor(event.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchor(null);

  // Notification menu handlers
  const handleNotifMenu = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  // Drawer handlers
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Fetch notifications from backend
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications({ limit: 20 });
      setNotifications(data.notifications);
      setUnreadCount(data.stats ? data.stats.unread : data.notifications.filter(n => !n.is_read).length);
    } catch (e) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  // WebSocket functionality removed to prevent runtime errors
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const handleNotification = (data) => {
  //       if (data.type === 'notification') {
  //         loadNotifications();
  //       }
  //     };

  //     websocketService.subscribe('message', handleNotification);
  //     return () => websocketService.unsubscribe('message', handleNotification);
  //   }
  // }, [isAuthenticated]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job':
        return <WorkIcon fontSize="small" />;
      case 'event':
        return <EventIcon fontSize="small" />;
      case 'info':
        return <InfoIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const navigationItems = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/jobs', label: 'Jobs', icon: <WorkIcon /> },
    { to: '/services', label: 'Services', icon: <ArticleIcon /> },
    { to: '/success-stories', label: 'Success Stories', icon: <BarChartIcon /> },
    { to: '/about-us', label: 'About', icon: <InfoIcon /> },
    { to: '/enquiry', label: 'Contact', icon: <EventIcon /> },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(11, 68, 74, 0.1)' : 'none',
        boxShadow: isScrolled ? '0 2px 8px rgba(11, 68, 74, 0.1)' : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 }, minHeight: 64 }}>
          {/* Logo */}
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
            }}
          >
            <Box
              component="img"
              src="/images/cs.svg"
              alt="Career Solutions Logo"
              sx={{
                height: { xs: 40, md: 50 },
                width: 'auto',
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isScrolled ? theme.palette.primary.main : '#ffffff',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontFamily: '"Josefin Sans", sans-serif',
                transition: 'color 0.3s ease-in-out',
              }}
            >
              Career Solutions
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    color: isScrolled ? theme.palette.text.primary : '#ffffff',
                    mx: 1,
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontWeight: 500,
                    transition: 'all 0.3s ease-in-out',
                    '&.active': {
                      color: theme.palette.primary.main,
                      backgroundColor: 'transparent',
                    },
                    '&:hover': {
                      backgroundColor: isScrolled ? 'rgba(11, 68, 74, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {/* Notifications */}
            {isAuthenticated && (
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotifMenu}
                  sx={{ 
                    color: isScrolled ? theme.palette.text.primary : '#ffffff',
                    mr: 1,
                    transition: 'color 0.3s ease-in-out',
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {userRole === 'admin' && (
                  <Button
                    onClick={handleAdminMenuOpen}
                    sx={{
                      color: isScrolled ? theme.palette.text.primary : '#ffffff',
                      mr: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        backgroundColor: isScrolled ? 'rgba(11, 68, 74, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  component={NavLink}
                  to="/profile"
                  sx={{
                    color: isScrolled ? theme.palette.text.primary : '#ffffff',
                    mr: 1,
                    fontFamily: '"Josefin Sans", sans-serif',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: isScrolled ? 'rgba(11, 68, 74, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  startIcon={<ExitToAppIcon />}
                  sx={{
                    color: isScrolled ? theme.palette.text.primary : '#ffffff',
                    fontFamily: '"Josefin Sans", sans-serif',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: isScrolled ? 'rgba(11, 68, 74, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: isScrolled ? theme.palette.primary.main : '#0B444A',
                  color: '#ffffff',
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerOpen}
                sx={{ 
                  color: isScrolled ? theme.palette.text.primary : '#ffffff',
                  ml: 1,
                  transition: 'color 0.3s ease-in-out',
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Admin Menu */}
      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={NavLink} to="/admin" onClick={handleAdminMenuClose}>
          <DashboardIcon sx={{ mr: 1 }} />
          Dashboard
        </MenuItem>
        <MenuItem component={NavLink} to="/admin/analytics" onClick={handleAdminMenuClose}>
          <BarChartIcon sx={{ mr: 1 }} />
          Analytics
        </MenuItem>
        <MenuItem component={NavLink} to="/admin/users" onClick={handleAdminMenuClose}>
          <GroupIcon sx={{ mr: 1 }} />
          Users
        </MenuItem>
        <MenuItem component={NavLink} to="/admin/content" onClick={handleAdminMenuClose}>
          <ArticleIcon sx={{ mr: 1 }} />
          Content
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                startIcon={<DoneAllIcon />}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <Box key={notification.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                <ListItem sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.600' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: notification.is_read ? 400 : 600 }}>
                          {notification.title}
                        </Typography>
                        {!notification.is_read && (
                          <FiberManualRecordIcon sx={{ fontSize: 8, color: theme.palette.primary.main }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {!notification.is_read && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{ color: 'grey.500' }}
                      >
                        <DoneAllIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteNotification(notification.id)}
                      sx={{ color: 'grey.500' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              </Box>
            ))
          )}
        </Box>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <FocusTrap active={drawerOpen}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                Menu
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List sx={{ pt: 0 }}>
              {navigationItems.map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.to}
                    onClick={handleDrawerClose}
                    sx={{
                      '&.active': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              {isAuthenticated ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/profile" onClick={handleDrawerClose}>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                  </ListItem>
                  {userRole === 'admin' && (
                    <ListItem disablePadding>
                      <ListItemButton component={NavLink} to="/admin" onClick={handleDrawerClose}>
                        <ListItemText primary="Admin Dashboard" />
                      </ListItemButton>
                    </ListItem>
                  )}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton component={NavLink} to="/login" onClick={handleDrawerClose}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </FocusTrap>
      </Drawer>
    </AppBar>
  );
};

export default Header;