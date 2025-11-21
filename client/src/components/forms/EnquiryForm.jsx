import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import trackEvent from '../../services/trackEvent';
import { useTheme } from '@mui/material/styles';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    service: '',
    package: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Get service and package from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    const packageName = params.get('package');
    
    if (service) {
      setFormData(prev => ({ ...prev, service }));
    }
    if (packageName) {
      setFormData(prev => ({ ...prev, package: packageName }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName || formData.firstName.trim() === '') newErrors.firstName = 'First name is required';
    if (!formData.lastName || formData.lastName.trim() === '') newErrors.lastName = 'Last name is required';
    if (!formData.email || formData.email.trim() === '') newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone || formData.phone.trim() === '') newErrors.phone = 'Phone number is required';
    if (!formData.message || formData.message.trim() === '') newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage('');

    try {
      const response = await fetch(`${API_URL}/api/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit enquiry');
      }

      await trackEvent('form_submission', { form_type: 'enquiry', email: formData.email });

      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your enquiry has been submitted successfully. We\'ll get back to you within 24 hours.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        service: formData.service,
        package: formData.package
      });
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred while submitting your enquiry. Please try again or contact us directly.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" fontWeight={700} color="white" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.9)" sx={{ maxWidth: 800, mx: 'auto' }}>
              Ready to take the next step in your career? Let's discuss how we can help you achieve your goals.
            </Typography>
          </Box>
        </motion.div>

        {/* Success/Error Message */}
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              severity={submitStatus === 'success' ? 'success' : 'error'}
              sx={{ mb: 4, fontSize: 16 }}
              icon={submitStatus === 'success' ? <CheckCircleIcon /> : <WarningIcon />}
            >
              {submitMessage}
            </Alert>
          </motion.div>
        )}

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Service Info */}
            {(formData.service || formData.package) && (
              <Alert
                severity="info"
                sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.dark' }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Selected Service
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {formData.service && (
                    <Chip label={`Service: ${formData.service}`} color="primary" variant="outlined" />
                  )}
                  {formData.package && (
                    <Chip label={`Package: ${formData.package}`} color="secondary" variant="outlined" />
                  )}
                </Stack>
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={4}>
                {/* Name Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-root': { height: 56 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-root': { height: 56 } }}
                    />
                  </Grid>
                </Grid>

                {/* Contact Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-root': { height: 56 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-root': { height: 56 } }}
                    />
                  </Grid>
                </Grid>

                {/* Message Field */}
                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={6}
                  error={!!errors.message}
                  helperText={errors.message}
                  placeholder="Tell us about your career goals and how we can help you..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <MessageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiInputBase-root': { 
                      minHeight: 120,
                      alignItems: 'flex-start',
                      pt: 1
                    }
                  }}
                />

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      py: 2,
                      fontSize: 18,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
                  </Button>
                </motion.div>
              </Stack>
            </Box>

            {/* Additional Info */}
            <Box 
              mt={6} 
              p={3} 
              sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                What happens next?
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="We'll review your enquiry within 24 hours" 
                    primaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Our team will contact you to discuss your needs" 
                    primaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="We'll provide a personalized solution and quote" 
                    primaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Start your journey to career success!" 
                    primaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default EnquiryForm;