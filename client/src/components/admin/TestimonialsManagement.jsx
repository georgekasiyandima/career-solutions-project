import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Card,
  CardContent,
  useTheme,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaGlobe,
} from 'react-icons/fa';
import { apiService } from '../../config/api';

const TestimonialsManagement = () => {
  const theme = useTheme();
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCountry: '',
    serviceType: '',
    interviewsGranted: 0,
    offersReceived: 0,
    offersAccepted: 0,
    onboarded: false,
    onboardingDate: '',
    jobTitle: '',
    companyName: '',
    jobLocation: '',
    jobCountry: '',
    salaryOffered: '',
    currency: 'ZAR',
    serviceCompletedDate: '',
    firstInterviewDate: '',
    offerReceivedDate: '',
    startDate: '',
    testimonial: '',
    rating: 5,
    isFeatured: false,
    photoUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTestimonialsMetrics();
      setTestimonials(response.data || response);
    } catch (err) {
      setError('Failed to fetch testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getTestimonialsStats();
      setStats(response.data || response);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleOpenDialog = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        clientName: testimonial.client_name || '',
        clientEmail: testimonial.client_email || '',
        clientPhone: testimonial.client_phone || '',
        clientCountry: testimonial.client_country || '',
        serviceType: testimonial.service_type || '',
        interviewsGranted: testimonial.interviews_granted || 0,
        offersReceived: testimonial.offers_received || 0,
        offersAccepted: testimonial.offers_accepted || 0,
        onboarded: testimonial.onboarded || false,
        onboardingDate: testimonial.onboarding_date ? testimonial.onboarding_date.split('T')[0] : '',
        jobTitle: testimonial.job_title || '',
        companyName: testimonial.company_name || '',
        jobLocation: testimonial.job_location || '',
        jobCountry: testimonial.job_country || '',
        salaryOffered: testimonial.salary_offered || '',
        currency: testimonial.currency || 'ZAR',
        serviceCompletedDate: testimonial.service_completed_date ? testimonial.service_completed_date.split('T')[0] : '',
        firstInterviewDate: testimonial.first_interview_date ? testimonial.first_interview_date.split('T')[0] : '',
        offerReceivedDate: testimonial.offer_received_date ? testimonial.offer_received_date.split('T')[0] : '',
        startDate: testimonial.start_date ? testimonial.start_date.split('T')[0] : '',
        testimonial: testimonial.testimonial || '',
        rating: testimonial.rating || 5,
        isFeatured: testimonial.is_featured || false,
        photoUrl: testimonial.photo_url || '',
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientCountry: '',
        serviceType: '',
        interviewsGranted: 0,
        offersReceived: 0,
        offersAccepted: 0,
        onboarded: false,
        onboardingDate: '',
        jobTitle: '',
        companyName: '',
        jobLocation: '',
        jobCountry: '',
        salaryOffered: '',
        currency: 'ZAR',
        serviceCompletedDate: '',
        firstInterviewDate: '',
        offerReceivedDate: '',
        startDate: '',
        testimonial: '',
        rating: 5,
        isFeatured: false,
        photoUrl: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTestimonial(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (editingTestimonial) {
        await apiService.updateTestimonial(editingTestimonial.id, formData);
        setSuccess('Testimonial updated successfully');
      } else {
        await apiService.createTestimonial(formData);
        setSuccess('Testimonial created successfully');
      }
      
      fetchTestimonials();
      fetchStats();
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await apiService.deleteTestimonial(id);
        setSuccess('Testimonial deleted successfully');
        fetchTestimonials();
        fetchStats();
      } catch (err) {
        setError('Failed to delete testimonial');
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
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
          <Box>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700}>
            Testimonials Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.secondary.main },
            }}
          >
            Add Testimonial
          </Button>
        </Stack>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Testimonials"
                value={stats.totalTestimonials}
                icon={FaUsers}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Interviews Granted"
                value={stats.totalInterviewsGranted}
                icon={FaBriefcase}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Offers Received"
                value={stats.totalOffersReceived}
                icon={FaCheckCircle}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Success Rate"
                value={`${stats.interviewSuccessRate}%`}
                icon={FaChartLine}
                color={theme.palette.warning.main}
              />
            </Grid>
          </Grid>
        )}

        {/* Testimonials Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Interviews</TableCell>
                <TableCell>Offers</TableCell>
                <TableCell>Onboarded</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>{testimonial.client_name}</TableCell>
                  <TableCell>{testimonial.service_type || 'N/A'}</TableCell>
                  <TableCell>{testimonial.interviews_granted || 0}</TableCell>
                  <TableCell>{testimonial.offers_received || 0}</TableCell>
                  <TableCell>
                    {testimonial.onboarded ? (
                      <Chip label="Yes" color="success" size="small" />
                    ) : (
                      <Chip label="No" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{testimonial.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <FaStar color="#FFD700" />
                      <Typography variant="body2">{testimonial.rating || 'N/A'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={testimonial.is_approved ? 'Approved' : 'Pending'}
                      color={testimonial.is_approved ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(testimonial)}
                        color="primary"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(testimonial.id)}
                        color="error"
                      >
                        <FaTrash />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Email"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Country"
                value={formData.clientCountry}
                onChange={(e) => setFormData({ ...formData, clientCountry: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  label="Service Type"
                >
                  <MenuItem value="Resume Creation">Resume Creation</MenuItem>
                  <MenuItem value="Cover Letter">Cover Letter</MenuItem>
                  <MenuItem value="Visa Applications">Visa Applications</MenuItem>
                  <MenuItem value="Cruise Ship Jobs">Cruise Ship Jobs</MenuItem>
                  <MenuItem value="Overseas Land Jobs">Overseas Land Jobs</MenuItem>
                  <MenuItem value="Interview Preparation">Interview Preparation</MenuItem>
                  <MenuItem value="Career Guidance">Career Guidance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Interviews Granted"
                type="number"
                value={formData.interviewsGranted}
                onChange={(e) => setFormData({ ...formData, interviewsGranted: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Offers Received"
                type="number"
                value={formData.offersReceived}
                onChange={(e) => setFormData({ ...formData, offersReceived: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Offers Accepted"
                type="number"
                value={formData.offersAccepted}
                onChange={(e) => setFormData({ ...formData, offersAccepted: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Completed Date"
                type="date"
                value={formData.serviceCompletedDate}
                onChange={(e) => setFormData({ ...formData, serviceCompletedDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Interview Date"
                type="date"
                value={formData.firstInterviewDate}
                onChange={(e) => setFormData({ ...formData, firstInterviewDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Offer Received Date"
                type="date"
                value={formData.offerReceivedDate}
                onChange={(e) => setFormData({ ...formData, offerReceivedDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Onboarding Date"
                type="date"
                value={formData.onboardingDate}
                onChange={(e) => setFormData({ ...formData, onboardingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Testimonial"
                multiline
                rows={4}
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating (1-5)"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Featured</InputLabel>
                <Select
                  value={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value })}
                  label="Featured"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingTestimonial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestimonialsManagement;




