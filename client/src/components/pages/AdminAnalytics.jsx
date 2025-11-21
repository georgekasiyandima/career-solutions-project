import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaEye, 
  FaUsers, 
  FaMousePointer, 
  FaCalendarAlt, 
  FaEnvelope,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaDownload,
  FaFilter,
  FaRedo,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaMapMarkerAlt,
  FaLink,
  FaSearch,
  FaBell
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../config/constants';
import { Box, Container, Stack, Typography, Button, Tabs, Tab, Grid, Paper } from '@mui/material';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    kpis: {
      totalViews: 0,
      uniqueSessions: 0,
      totalClicks: 0,
      totalBookings: 0,
      totalEnquiries: 0,
      totalUsers: 0,
      conversionRate: 0
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
      recentEvents: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      console.log('Analytics token:', token);
      const response = await axios.get(`${API_BASE_URL}/analytics/summary?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalytics(response.data);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/20 border border-${color}-500/30`}>
          <Icon className={`text-xl text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white font-poppins mb-1">{value}</h3>
      <p className="text-white/70 font-poppins text-sm">{title}</p>
      {subtitle && <p className="text-white/50 font-poppins text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white font-poppins mb-4">{title}</h3>
      {children}
    </div>
  );

  const SimpleChart = ({ data, title, color = 'blue' }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-32">
          <p className="text-white/60 font-poppins">No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.views || d.bookings || d.enquiries || 0));
    
    return (
      <div className="space-y-2">
        {data.slice(0, 7).map((item, index) => {
          const value = item.views || item.bookings || item.enquiries || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-white/70 font-poppins text-xs">
                {item.date}
              </div>
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div 
                  className={`bg-${color}-400 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-white font-poppins text-xs text-right">
                {value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TableCard = ({ title, data, columns }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white font-poppins mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {columns.map((column, index) => (
                <th key={index} className="text-left py-3 px-4 text-white/70 font-poppins text-sm">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-3 px-4 text-white font-poppins text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-white/60 font-poppins">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a3d3f 0%, #00C853 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <div className="flex items-center justify-center h-64">
            <div className="text-white font-poppins text-xl">Loading analytics...</div>
          </div>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a3d3f 0%, #00C853 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-6 rounded-2xl">
            <p className="font-poppins">{error}</p>
          </div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a3d3f 0%, #00C853 100%)', py: 8 }}>
      <Container maxWidth="lg">
        
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 48 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', fontFamily: 'Poppins, Inter, sans-serif' }}>
              Analytics Dashboard
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button onClick={fetchAnalyticsData} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.20)' }}>
                <FaRedo style={{ marginRight: 8 }} /> Refresh
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.20)' }}>
                <FaDownload style={{ marginRight: 8 }} /> Download
              </Button>
            </Stack>
          </Stack>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'Poppins, Inter, sans-serif', maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
            Comprehensive analytics and insights for your Career Solutions platform.
          </Typography>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          style={{ marginBottom: 32 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins, Inter, sans-serif' }}>Time Period:</Typography>
            {['7d', '30d', '90d', '1y'].map((p) => (
              <Button
                key={p}
                onClick={() => setPeriod(p)}
                variant={period === p ? 'contained' : 'outlined'}
                sx={{
                  bgcolor: period === p ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.20)',
                  fontWeight: 600,
                  fontFamily: 'Poppins, Inter, sans-serif',
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                {p}
              </Button>
            ))}
          </Stack>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          style={{ marginBottom: 32 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            centered
            textColor="inherit"
            TabIndicatorProps={{ style: { background: '#00C853', height: 4, borderRadius: 2 } }}
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                color: 'white',
                fontWeight: 600,
                fontFamily: 'Poppins, Inter, sans-serif',
                fontSize: 18,
                textTransform: 'capitalize',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.3s',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.20)',
                  color: '#00C853',
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.10)',
                },
              },
            }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Traffic" value="traffic" />
            <Tab label="Conversions" value="conversions" />
            <Tab label="Devices" value="devices" />
            <Tab label="Pages" value="pages" />
          </Tabs>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 140,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.03)' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(33,150,243,0.18)',
                          border: '1px solid rgba(33,150,243,0.32)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FaEye style={{ color: '#2196f3', fontSize: 22 }} />
                      </Box>
                    </Stack>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {analytics.kpis.totalViews?.toLocaleString() || '0'}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      Total Views
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      {period} period
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 140,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.03)' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(33,150,243,0.18)',
                          border: '1px solid rgba(33,150,243,0.32)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FaGlobe style={{ color: '#2196f3', fontSize: 22 }} />
                      </Box>
                    </Stack>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {analytics.kpis.uniqueSessions?.toLocaleString() || '0'}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      Unique Sessions
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      {period} period
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 140,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.03)' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(33,150,243,0.18)',
                          border: '1px solid rgba(33,150,243,0.32)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FaChartLine style={{ color: '#2196f3', fontSize: 22 }} />
                      </Box>
                    </Stack>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {`${analytics.kpis.conversionRate || '0'}%`}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      Conversion Rate
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      Bookings + Enquiries / Views
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 140,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.03)' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(33,150,243,0.18)',
                          border: '1px solid rgba(33,150,243,0.32)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FaUsers style={{ color: '#2196f3', fontSize: 22 }} />
                      </Box>
                    </Stack>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {analytics.kpis.totalUsers?.toLocaleString() || '0'}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      Total Users
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      {period} period
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            {/* Charts Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Page Views Over Time
                    </Typography>
                    {/* SimpleChart for viewsOverTime */}
                    <Stack spacing={2}>
                      {analytics.charts.viewsOverTime?.length ? (
                        analytics.charts.viewsOverTime.slice(0, 7).map((item, index) => {
                          const maxValue = Math.max(...analytics.charts.viewsOverTime.map(d => d.views || 0));
                          const percentage = maxValue > 0 ? ((item.views || 0) / maxValue) * 100 : 0;
                          return (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, width: 60 }}>
                                {item.date}
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.10)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#2196f3', height: 8, borderRadius: 2, width: `${percentage}%`, transition: 'width 0.5s' }} />
                              </Box>
                              <Typography sx={{ color: 'white', fontSize: 13, width: 40, textAlign: 'right' }}>
                                {item.views}
                              </Typography>
                            </Stack>
                          );
                        })
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Bookings Over Time
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.charts.bookingsOverTime?.length ? (
                        analytics.charts.bookingsOverTime.slice(0, 7).map((item, index) => {
                          const maxValue = Math.max(...analytics.charts.bookingsOverTime.map(d => d.bookings || 0));
                          const percentage = maxValue > 0 ? ((item.bookings || 0) / maxValue) * 100 : 0;
                          return (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, width: 60 }}>
                                {item.date}
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.10)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#4caf50', height: 8, borderRadius: 2, width: `${percentage}%`, transition: 'width 0.5s' }} />
                              </Box>
                              <Typography sx={{ color: 'white', fontSize: 13, width: 40, textAlign: 'right' }}>
                                {item.bookings}
                              </Typography>
                            </Stack>
                          );
                        })
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Page Views Trend
                    </Typography>
                    {/* SimpleChart for viewsOverTime */}
                    <Stack spacing={2}>
                      {analytics.charts.viewsOverTime?.length ? (
                        analytics.charts.viewsOverTime.slice(0, 7).map((item, index) => {
                          const maxValue = Math.max(...analytics.charts.viewsOverTime.map(d => d.views || 0));
                          const percentage = maxValue > 0 ? ((item.views || 0) / maxValue) * 100 : 0;
                          return (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, width: 60 }}>
                                {item.date}
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.10)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#2196f3', height: 8, borderRadius: 2, width: `${percentage}%`, transition: 'width 0.5s' }} />
                              </Box>
                              <Typography sx={{ color: 'white', fontSize: 13, width: 40, textAlign: 'right' }}>
                                {item.views}
                              </Typography>
                            </Stack>
                          );
                        })
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Top Referrers
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.tables.topReferrers?.length ? (
                        analytics.tables.topReferrers.map((row, index) => (
                          <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 15 }}>
                              {row.referrer}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                              {row.visits}
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Conversions Tab */}
        {activeTab === 'conversions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Bookings Trend
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.charts.bookingsOverTime?.length ? (
                        analytics.charts.bookingsOverTime.slice(0, 7).map((item, index) => {
                          const maxValue = Math.max(...analytics.charts.bookingsOverTime.map(d => d.bookings || 0));
                          const percentage = maxValue > 0 ? ((item.bookings || 0) / maxValue) * 100 : 0;
                          return (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, width: 60 }}>
                                {item.date}
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.10)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#4caf50', height: 8, borderRadius: 2, width: `${percentage}%`, transition: 'width 0.5s' }} />
                              </Box>
                              <Typography sx={{ color: 'white', fontSize: 13, width: 40, textAlign: 'right' }}>
                                {item.bookings}
                              </Typography>
                            </Stack>
                          );
                        })
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Enquiries Trend
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.charts.enquiriesOverTime?.length ? (
                        analytics.charts.enquiriesOverTime.slice(0, 7).map((item, index) => {
                          const maxValue = Math.max(...analytics.charts.enquiriesOverTime.map(d => d.enquiries || 0));
                          const percentage = maxValue > 0 ? ((item.enquiries || 0) / maxValue) * 100 : 0;
                          return (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, width: 60 }}>
                                {item.date}
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.10)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#FFC107', height: 8, borderRadius: 2, width: `${percentage}%`, transition: 'width 0.5s' }} />
                              </Box>
                              <Typography sx={{ color: 'white', fontSize: 13, width: 40, textAlign: 'right' }}>
                                {item.enquiries}
                              </Typography>
                            </Stack>
                          );
                        })
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Device Statistics
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.tables.deviceStats?.length ? (
                        analytics.tables.deviceStats.map((device, index) => (
                          <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 15 }}>
                              {device.device}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                              {device.count} visits
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No device data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Device Distribution
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.tables.deviceStats?.length ? (
                        analytics.tables.deviceStats.map((device, index) => (
                          <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                          }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {device.device === 'Mobile' ? (
                                <FaMobile style={{ color: '#2196f3' }} />
                              ) : device.device === 'Desktop' ? (
                                <FaDesktop style={{ color: '#4caf50' }} />
                              ) : (
                                <FaGlobe style={{ color: '#9c27b0' }} />
                              )}
                              <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 15 }}>
                                {device.device}
                              </Typography>
                            </Stack>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                              {device.count} visits
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No device data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Top Pages
                    </Typography>
                    <Stack spacing={2}>
                      {analytics.tables.topPages?.length ? (
                        analytics.tables.topPages.map((page, index) => (
                          <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 15 }}>
                              {page.page}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                              {page.views} views
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No page data available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 3,
                      minHeight: 200,
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'scale(1.02)' },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                      Recent Events
                    </Typography>
                    <Stack spacing={2} sx={{ maxHeight: 384, overflowY: 'auto' }}>
                      {analytics.tables.recentEvents?.length ? (
                        analytics.tables.recentEvents.map((event, index) => (
                          <Stack key={index} direction="row" alignItems="center" spacing={2} sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                          }}>
                            <Box sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: 'rgba(33,150,243,0.18)',
                              border: '1px solid rgba(33,150,243,0.32)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <FaBell style={{ color: '#2196f3', fontSize: 16 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.event_type}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.session_id}
                              </Typography>
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                              {new Date(event.created_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                          No recent events
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default AdminAnalytics; 