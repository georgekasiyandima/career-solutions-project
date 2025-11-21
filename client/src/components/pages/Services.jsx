import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextareaAutosize,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  FaFileAlt,
  FaEnvelope,
  FaPassport,
  FaShip,
  FaGlobe,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { apiService } from '../../config/api';

const services = [
  {
    id: 'resume-local',
    title: 'Local Resume',
    icon: FaFileAlt,
    description: 'Professional resume tailored for South African job market',
    price: 350,
    category: 'resume',
    type: 'local',
    features: [
      'ATS-compliant resume',
      'Optimized for local SA job market',
      '3 rounds of revisions',
      'Professional formatting',
    ],
  },
  {
    id: 'resume-international',
    title: 'International Resume',
    icon: FaFileAlt,
    description: 'Professional resume for global opportunities',
    price: 500,
    category: 'resume',
    type: 'international',
    features: [
      'ATS-compliant resume',
      'Optimized for international markets',
      '3 rounds of revisions',
      'Professional formatting',
    ],
  },
  {
    id: 'resume-package',
    title: 'Complete Career Package',
    icon: FaFileAlt,
    description: 'Comprehensive package with ongoing support',
    price: 1000,
    category: 'resume',
    type: 'package',
    popular: true,
    features: [
      'Professional resume (Local or International)',
      'Constant link updates for new positions',
      'Private email addresses of hiring managers',
      'Interview prep kit and guidance',
      'General technical support during application period',
      'Email support when contacting recruiters',
      'Ongoing support throughout the process',
    ],
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter',
    icon: FaEnvelope,
    description: 'Professional cover letter tailored to your application',
    price: 250,
    category: 'cover-letter',
    features: [
      'Personalized content',
      'Industry-specific language',
      '2 rounds of revisions',
      'Professional formatting',
    ],
  },
  {
    id: 'visa-application',
    title: 'Visa Applications',
    icon: FaPassport,
    description: 'All visa categories and jurisdictions across the globe',
    price: 1000,
    category: 'visa',
    features: [
      'All visa categories',
      'All jurisdictions worldwide',
      'Step-by-step guidance',
      'Documentation support',
      'Application review',
    ],
    requiresDetails: true,
  },
];

const socialLinks = {
  whatsapp: { 
    url: 'https://wa.me/27749998812', 
    label: '+27 74 999 8812',
    icon: FaWhatsapp 
  },
  tiktok: { 
    url: 'https://www.tiktok.com/@career.solutions6', 
    label: '@career.solutions6',
    icon: FaTiktok 
  },
  facebook: { 
    url: 'https://www.facebook.com/Ship2ShoreCareers', 
    label: 'Ship2Shore Careers',
    icon: FaFacebook 
  },
  instagram: { 
    url: 'https://www.instagram.com/career.solutions', 
    label: '@career.solutions',
    icon: FaInstagram 
  },
};

const steps = ['Select Service', 'Provide Details', 'Review & Pay', 'Confirmation'];

const Services = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    resumeType: '',
    visaType: '',
    visaCategory: '',
    isFirstTime: '',
    additionalInfo: '',
    fullName: '',
    email: '',
    phone: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData({
      ...formData,
      serviceType: service.id,
      resumeType: service.type === 'package' ? '' : service.type,
    });
    setActiveStep(0);
    setDialogOpen(true);
    setError(null);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate service selection
      if (!selectedService) {
        setError('Please select a service');
        return;
      }
      if (selectedService.category === 'resume' && selectedService.type === 'package' && !formData.resumeType) {
        setError('Please select resume type (Local or International)');
        return;
      }
    }
    if (activeStep === 1) {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
      if (selectedService.requiresDetails && selectedService.category === 'visa') {
        if (!formData.visaType || !formData.visaCategory || !formData.isFirstTime) {
          setError('Please provide all visa application details');
          return;
        }
      }
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create service order
      const orderData = {
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        price: selectedService.price,
        formData: {
          ...formData,
          resumeType: selectedService.type === 'package' ? formData.resumeType : selectedService.type,
        },
      };

      const response = await apiService.createServiceOrder(orderData);
      
      // Redirect to payment page with order number
      navigate(`/payment?orderNumber=${response.data.orderNumber}&amount=${selectedService.price}`);
    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedService(null);
    setActiveStep(0);
    setFormData({
      serviceType: '',
      resumeType: '',
      visaType: '',
      visaCategory: '',
      isFirstTime: '',
      additionalInfo: '',
      fullName: '',
      email: '',
      phone: '',
      country: '',
    });
    setError(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#0B444A', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              fontFamily: '"Josefin Sans", sans-serif',
            }}
          >
            Our Services
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748b', 
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              fontFamily: '"Josefin Sans", sans-serif',
            }}
          >
            Your Pathway to Global Career Opportunities
          </Typography>
          
          {/* Social Media Links */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 4, flexWrap: 'wrap', gap: 2 }}
          >
            {Object.entries(socialLinks).map(([key, social]) => {
              const Icon = social.icon;
              return (
                <Button
                  key={key}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<Icon />}
                  sx={{
                    borderColor: '#0B444A',
                    color: '#0B444A',
                    fontFamily: '"Josefin Sans", sans-serif',
                    '&:hover': {
                      borderColor: '#13484C',
                      backgroundColor: 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  {social.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Grid item xs={12} md={6} lg={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(11, 68, 74, 0.1)',
                    border: '1px solid rgba(11, 68, 74, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(11, 68, 74, 0.2)',
                    },
                  }}
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.popular && (
                    <Chip
                      icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />}
                      label="Most Popular"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 600,
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        backgroundColor: '#0B444A',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <Icon style={{ fontSize: 32, color: '#ffffff' }} />
                    </Box>
                    
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: '#0B444A',
                        mb: 2,
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {service.title}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#64748b',
                        mb: 3,
                        flexGrow: 1,
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {service.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#0B444A',
                          fontFamily: '"Josefin Sans", sans-serif',
                        }}
                      >
                        R{service.price}
                      </Typography>
                    </Box>
                    
                    <Box component="ul" sx={{ pl: 2, mb: 3, listStyle: 'none' }}>
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <Box
                          component="li"
                          key={idx}
                          sx={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            fontFamily: '"Josefin Sans", sans-serif',
                          }}
                        >
                          <CheckCircleIcon
                            sx={{ color: '#0B444A', fontSize: 16, mr: 1, mt: 0.5, flexShrink: 0 }}
                          />
                          <span>{feature}</span>
                        </Box>
                      ))}
                      {service.features.length > 3 && (
                        <Typography
                          variant="caption"
                          sx={{ color: '#0B444A', fontFamily: '"Josefin Sans", sans-serif' }}
                        >
                          +{service.features.length - 3} more features
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#0B444A',
                        color: '#ffffff',
                        py: 1.5,
                        fontWeight: 600,
                        fontFamily: '"Josefin Sans", sans-serif',
                        '&:hover': {
                          backgroundColor: '#13484C',
                        },
                      }}
                    >
                      Select Service
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Service Selection Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#0B444A',
              color: '#ffffff',
              fontFamily: '"Josefin Sans", sans-serif',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: '"Josefin Sans", sans-serif' }}>
              {selectedService?.title}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: '#ffffff' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ fontFamily: '"Josefin Sans", sans-serif' }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 0: Service Selection */}
            {activeStep === 0 && selectedService && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Josefin Sans", sans-serif' }}>
                  Service Details
                </Typography>
                
                {selectedService.type === 'package' && (
                  <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                    <FormLabel component="legend" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Resume Type (Required)
                    </FormLabel>
                    <RadioGroup
                      value={formData.resumeType}
                      onChange={(e) => setFormData({ ...formData, resumeType: e.target.value })}
                    >
                      <FormControlLabel
                        value="local"
                        control={<Radio />}
                        label="Local Resume (for SA jobs)"
                        sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      />
                      <FormControlLabel
                        value="international"
                        control={<Radio />}
                        label="International Resume (for global opportunities)"
                        sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      />
                    </RadioGroup>
                  </FormControl>
                )}

                <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                    What's Included:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {selectedService.features.map((feature, idx) => (
                      <Box
                        component="li"
                        key={idx}
                        sx={{
                          color: '#64748b',
                          mb: 1,
                          fontFamily: '"Josefin Sans", sans-serif',
                        }}
                      >
                        {feature}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Step 1: Form Details */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Josefin Sans", sans-serif' }}>
                  Your Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Country of Origin"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    />
                  </Grid>

                  {selectedService?.category === 'visa' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Visa Type *"
                          value={formData.visaType}
                          onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                          placeholder="e.g., C1/D, Schengen, Tourist"
                          required
                          sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Visa Category *"
                          value={formData.visaCategory}
                          onChange={(e) => setFormData({ ...formData, visaCategory: e.target.value })}
                          placeholder="e.g., Crew Visa, Work Visa"
                          required
                          sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                          <FormLabel component="legend" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                            Is this your first time applying? *
                          </FormLabel>
                          <RadioGroup
                            value={formData.isFirstTime}
                            onChange={(e) => setFormData({ ...formData, isFirstTime: e.target.value })}
                            row
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label="Yes, First Time"
                              sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No, Renewal"
                              sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Information"
                      multiline
                      rows={4}
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="Any additional information that might be helpful for your application..."
                      sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2: Review */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Josefin Sans", sans-serif' }}>
                  Review Your Order
                </Typography>

                <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                    Service: {selectedService?.title}
                  </Typography>
                  {selectedService?.type === 'package' && (
                    <Typography variant="body2" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Resume Type: {formData.resumeType === 'local' ? 'Local' : 'International'}
                    </Typography>
                  )}
                  {selectedService?.category === 'visa' && (
                    <>
                      <Typography variant="body2" sx={{ mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                        Visa Type: {formData.visaType}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                        Category: {formData.visaCategory}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                        Application Type: {formData.isFirstTime === 'yes' ? 'First Time' : 'Renewal'}
                      </Typography>
                    </>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0B444A', fontFamily: '"Josefin Sans", sans-serif' }}>
                    Total: R{selectedService?.price}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Back
            </Button>
            <Box>
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    backgroundColor: '#0B444A',
                    fontFamily: '"Josefin Sans", sans-serif',
                    '&:hover': { backgroundColor: '#13484C' },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#0B444A',
                    fontFamily: '"Josefin Sans", sans-serif',
                    '&:hover': { backgroundColor: '#13484C' },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
                </Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Services;
