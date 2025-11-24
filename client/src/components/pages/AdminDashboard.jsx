import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  IconButton, 
  Stack, 
  Grid, 
  Paper, 
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, 
  FaBriefcase, 
  FaRss, 
  FaChartLine, 
  FaCog, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaFileAlt,
  FaImage,
  FaVideo,
  FaLink,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBell,
  FaSearch,
  FaFilter,
  FaDownload,
  FaRedo,
  FaArrowUp,
  FaArrowDown,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaMousePointer,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaChartBar
} from 'react-icons/fa';
import { apiService } from '../../config/api';
import { API_BASE_URL, STORAGE_KEYS } from '../../config/constants';
import TestimonialsManagement from '../admin/TestimonialsManagement';
import ContentUpdatesManagement from '../admin/ContentUpdatesManagement';
import AnalyticsDashboard from '../admin/AnalyticsDashboard';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalViews: 0,
      uniqueSessions: 0,
      totalClicks: 0,
      totalBookings: 0,
      totalEnquiries: 0,
      totalUsers: 0,
      conversionRate: 0,
      systemHealth: 'healthy',
      activeUsers: 0,
      responseTime: 0
    },
    charts: {
      viewsOverTime: [],
      bookingsOverTime: [],
      enquiriesOverTime: []
    },
    tables: {
      topPages: [],
      topReferrers: [],
      deviceStats: [],
      recentEvents: [],
      systemAlerts: [],
      recentNotifications: []
    },
    system: {
      cpu: 0,
      memory: 0,
      disk: 0,
      uptime: 0,
      lastBackup: null,
      securityStatus: 'secure'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      console.log('User does not have admin role:', user?.role);
      navigate('/');
      return;
    }

    console.log('User authenticated:', user);
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data...');
      const response = await apiService.getAdminDashboard();
      console.log('Dashboard response:', response);

      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, status }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}20`,
            color: color,
          }}
        >
          <Icon size={20} />
        </Box>
        {trend && (
          <Chip
            label={`${trend === 'up' ? '+' : '-'}${trendValue}%`}
            size="small"
            sx={{
              bgcolor: trend === 'up' ? 'success.main' : 'error.main',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 0.5,
          color: theme.palette.text.primary,
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
        }}
      >
        {value.toLocaleString()}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: '0.875rem',
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            opacity: 0.7,
            fontSize: '0.75rem',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );

  const SystemHealthCard = ({ title, value, icon: Icon, color, status, details }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}20`,
            color: color,
            mr: 2,
          }}
        >
          <Icon size={18} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: '1.125rem',
            }}
          >
            {value}
          </Typography>
        </Box>
        <Chip
          label={status}
          size="small"
          sx={{
            bgcolor: status === 'healthy' ? 'success.main' : 'warning.main',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        />
      </Box>
      
      {details && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          {details}
        </Typography>
      )}
    </Paper>
  );

  const AlertCard = ({ alert }) => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        background: alert.severity === 'high' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 193, 7, 0.1)',
        border: `1px solid ${alert.severity === 'high' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alert.severity === 'high' ? 'error.main' : 'warning.main',
            color: 'white',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {alert.severity === 'high' ? <FaExclamationTriangle size={12} /> : <FaInfoCircle size={12} />}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: '0.875rem',
              mb: 0.5,
            }}
          >
            {alert.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              lineHeight: 1.4,
            }}
          >
            {alert.message}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, action }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
      onClick={action}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}20`,
            color: color,
            mr: 2,
          }}
        >
          <Icon size={18} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)', 
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" justifyContent="center" sx={{ height: 320 }}>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ fontSize: '1.125rem' }}
            >
              Loading dashboard...
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center"
              sx={{ fontSize: '0.875rem' }}
            >
              Fetching real-time data and analytics
            </Typography>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)', 
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            bgcolor: 'rgba(244,67,54,0.12)', 
            border: '1px solid rgba(244,67,54,0.32)', 
            color: '#f44336', 
            p: 4, 
            borderRadius: 3 
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.125rem' }}>
              Dashboard Error
            </Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{error}</Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2, fontSize: '0.875rem' }}
            >
              Retry
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#ffffff', 
      py: 4 
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            Welcome back, {user?.name || 'Admin'}. Here's your system overview.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
              },
            }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Analytics" value="analytics" />
            <Tab label="Testimonials" value="testimonials" />
            <Tab label="Content Updates" value="content" />
            <Tab label="System" value="system" />
            <Tab label="Users" value="users" />
          </Tabs>
        </Box>

        {/* Content */}
        {activeTab === 'overview' && (
          <Box>
            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Total Views"
                  value={dashboardData.kpis.totalViews}
                  subtitle="Last 30 days"
                  icon={FaEye}
                  color={theme.palette.primary.main}
                  trend="up"
                  trendValue={12}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Total Bookings"
                  value={dashboardData.kpis.totalBookings}
                  subtitle="Last 30 days"
                  icon={FaCalendarAlt}
                  color={theme.palette.secondary.main}
                  trend="up"
                  trendValue={8}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Total Users"
                  value={dashboardData.kpis.totalUsers}
                  subtitle="Registered users"
                  icon={FaUsers}
                  color={theme.palette.info.main}
                  trend="up"
                  trendValue={15}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Conversion Rate"
                  value={`${dashboardData.kpis.conversionRate}%`}
                  subtitle="Views to bookings"
                  icon={FaChartLine}
                  color={theme.palette.success.main}
                  trend="up"
                  trendValue={5}
                />
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: '1.125rem',
              }}
            >
              Quick Actions
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  title="Add User"
                  description="Create new user account"
                  icon={FaPlus}
                  color={theme.palette.primary.main}
                  action={() => navigate('/admin/users/add')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  title="View Reports"
                  description="Access detailed analytics"
                  icon={FaChartBar}
                  color={theme.palette.secondary.main}
                  action={() => setActiveTab('analytics')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  title="System Settings"
                  description="Configure system preferences"
                  icon={FaCog}
                  color={theme.palette.info.main}
                  action={() => setActiveTab('system')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  title="Send Notification"
                  description="Broadcast message to users"
                  icon={FaBell}
                  color={theme.palette.warning.main}
                  action={() => navigate('/admin/notifications')}
                />
              </Grid>
            </Grid>

            {/* Recent Alerts */}
            {dashboardData.tables.systemAlerts.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary,
                    fontSize: '1.125rem',
                  }}
                >
                  Recent Alerts
                </Typography>
                
                <Stack spacing={1}>
                  {dashboardData.tables.systemAlerts.slice(0, 3).map((alert, index) => (
                    <AlertCard key={index} alert={alert} />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'testimonials' && <TestimonialsManagement />}

        {activeTab === 'content' && <ContentUpdatesManagement />}

        {activeTab === 'system' && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.text.primary,
                fontSize: '1.125rem',
              }}
            >
              System Health
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <SystemHealthCard
                  title="CPU Usage"
                  value={`${dashboardData.system.cpu}%`}
                  icon={FaServer}
                  color={theme.palette.primary.main}
                  status={dashboardData.system.cpu < 80 ? 'healthy' : 'warning'}
                  details="Current processor utilization"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SystemHealthCard
                  title="Memory Usage"
                  value={`${dashboardData.system.memory}%`}
                  icon={FaDatabase}
                  color={theme.palette.secondary.main}
                  status={dashboardData.system.memory < 80 ? 'healthy' : 'warning'}
                  details="RAM utilization"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SystemHealthCard
                  title="Disk Usage"
                  value={`${dashboardData.system.disk}%`}
                  icon={FaShieldAlt}
                  color={theme.palette.info.main}
                  status={dashboardData.system.disk < 90 ? 'healthy' : 'warning'}
                  details="Storage space used"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 'users' && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.text.primary,
                fontSize: '1.125rem',
              }}
            >
              User Management
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              User management features coming soon.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
