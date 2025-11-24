import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaDollarSign,
  FaEnvelope,
  FaCheckCircle,
  FaGlobe,
} from 'react-icons/fa';
import { apiService } from '../../config/api';

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [testimonialsStats, setTestimonialsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [businessData, testimonialsData] = await Promise.all([
        apiService.getBusinessAnalytics({ startDate: getStartDate(period) }),
        apiService.getTestimonialsStats(),
      ]);
      
      setAnalytics(businessData.data || businessData);
      setTestimonialsStats(testimonialsData.data || testimonialsData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (period) => {
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    return startDate.toISOString().split('T')[0];
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            <Icon size={24} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const summary = analytics?.summary || {};
  const topServices = summary.topServices || [];
  const topCountries = summary.topCountries || [];

  // Prepare chart data
  const serviceChartData = topServices.map((service, index) => ({
    name: service.name,
    value: service.count,
    color: COLORS[index % COLORS.length],
  }));

  const countryChartData = topCountries.slice(0, 10).map((country, index) => ({
    name: country.country,
    value: country.count,
    color: COLORS[index % COLORS.length],
  }));

  // Mock time series data (replace with real data from backend)
  const timeSeriesData = [
    { date: 'Week 1', enquiries: 45, orders: 12, revenue: 15000 },
    { date: 'Week 2', enquiries: 52, orders: 18, revenue: 22000 },
    { date: 'Week 3', enquiries: 48, orders: 15, revenue: 18000 },
    { date: 'Week 4', enquiries: 61, orders: 22, revenue: 28000 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Analytics Dashboard
          </Typography>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Period"
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="365d">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Enquiries"
              value={summary.totalEnquiries || 0}
              icon={FaEnvelope}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Service Orders"
              value={summary.totalServiceSelections || 0}
              icon={FaBriefcase}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`R${(summary.totalRevenue || 0).toLocaleString()}`}
              icon={FaDollarSign}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Conversion Rate"
              value={`${summary.conversionRate || 0}%`}
              icon={FaChartLine}
              color={theme.palette.warning.main}
            />
          </Grid>
        </Grid>

        {/* Testimonials Stats */}
        {testimonialsStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Interviews Granted"
                value={testimonialsStats.totalInterviewsGranted || 0}
                icon={FaBriefcase}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Offers Received"
                value={testimonialsStats.totalOffersReceived || 0}
                icon={FaCheckCircle}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Success Rate"
                value={`${testimonialsStats.interviewSuccessRate || 0}%`}
                icon={FaChartLine}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Onboarded"
                value={testimonialsStats.totalOnboarded || 0}
                icon={FaUsers}
                color={theme.palette.primary.main}
              />
            </Grid>
          </Grid>
        )}

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Time Series Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Trends Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="enquiries"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Services Pie Chart */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Top Services
              </Typography>
              {serviceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Top Countries Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Top Countries
              </Typography>
              {countryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Service Performance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Service Performance
              </Typography>
              {topServices.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topServices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={theme.palette.secondary.main} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Top Services Table */}
        {topServices.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Top Performing Services
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service Name</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topServices.map((service, index) => {
                    const total = topServices.reduce((sum, s) => sum + s.count, 0);
                    const percentage = ((service.count / total) * 100).toFixed(1);
                    return (
                      <TableRow key={index}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell align="right">{service.count}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${percentage}%`}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default AnalyticsDashboard;




