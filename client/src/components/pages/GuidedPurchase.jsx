import React, { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import { 
  FaFileAlt, 
  FaEnvelope, 
  FaPassport, 
  FaShip, 
  FaGlobe, 
  FaLaptop, 
  FaArrowRight, 
  FaArrowLeft, 
  FaCheck, 
  FaInfoCircle, 
  FaShieldAlt, 
  FaUsers,
  FaStar,
  FaHandshake,
  FaCreditCard,
  FaWhatsapp
} from 'react-icons/fa';

const GuidedPurchase = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    goals: ''
  });

  const services = [
    {
      id: 1,
      title: 'Resume Creation',
      icon: FaFileAlt,
      description: 'Professional resume crafting to make you stand out',
      packages: [
        {
          name: 'Resume Only',
          price: 'R350',
          description: 'Get a professionally crafted resume tailored to your career goals.',
          features: ['Customized resume creation', 'ATS Compliant Resume', '3 rounds of revisions'],
          popular: false,
          details: 'Perfect for candidates who already have a good understanding of their target industry and just need a polished, professional resume that will pass through Applicant Tracking Systems (ATS) and catch the eye of hiring managers.'
        },
        {
          name: 'Full Comprehensive Package',
          price: 'R1000',
          description: 'Complete job application support package for maximum success.',
          features: [
            'Customized resume creation',
            'Professional email guidance',
            'Job website navigation tips',
            'Hiring company contacts',
            'Interview preparation',
            'Ongoing application support'
          ],
          popular: true,
          details: 'Our most comprehensive package designed for candidates who want complete support throughout their job search journey. This includes everything from resume creation to ongoing support during your job search process.'
        }
      ],
      benefits: '90% of clients reported increased interview callbacks within 30 days',
      process: [
        'Schedule consultation with career expert',
        'Provide work history and career goals',
        'Receive tailored resume within 3 days',
        'Collaborate on up to three revisions'
      ]
    },
    {
      id: 2,
      title: 'Cover Letter Creation',
      icon: FaEnvelope,
      description: 'Tailored cover letters that complement your resume',
      packages: [
        {
          name: 'Cover Letter Creation',
          price: 'R250',
          description: 'A tailored cover letter to match your resume and experience.',
          features: ['Personalized content', 'Industry-specific language', '2 rounds of revisions'],
          popular: false,
          details: 'A professionally written cover letter that tells your story and connects your experience to the specific job requirements. This is essential for making a strong first impression.'
        }
      ],
      benefits: '70% increase in application responses with our cover letters',
      process: [
        'Submit resume and job target',
        'Receive custom draft within 2 days',
        'Review and request revisions'
      ]
    },
    {
      id: 3,
      title: 'Visa Applications',
      icon: FaPassport,
      description: 'Expert guidance for international visa applications',
      packages: [
        {
          name: 'Visa Application Assistance',
          price: 'R1000',
          description: 'Professional assistance with your visa application process.',
          features: [
            'Step-by-step guidance',
            'Documentation support',
            'Consultation session',
            'USA C1/D, Schengen, Irish visas'
          ],
          popular: false,
          details: 'Comprehensive visa application support for various international destinations. We guide you through the entire process, ensuring all documentation is properly prepared and submitted.'
        }
      ],
      benefits: '95% success rate in visa applications',
      process: [
        'Book consultation for visa needs',
        'Submit documents for review',
        'Receive personalized support'
      ]
    },
    {
      id: 4,
      title: 'Cruise Ship Jobs',
      icon: FaShip,
      description: 'Complete application management for cruise ship positions',
      packages: [
        {
          name: 'Cruise Ship Application Package',
          price: 'R5000',
          description: 'We handle your entire cruise ship job application process.',
          features: [
            'Resume creation (if needed)',
            'Cover letter (if needed)',
            'Application submission',
            'Interview coaching',
            'R2500 upfront, R2500 after interview'
          ],
          popular: true,
          details: 'Complete end-to-end support for cruise ship job applications. We handle everything from initial application to interview preparation, with a success-based payment structure.'
        }
      ],
      benefits: 'Over 80% of clients secured interviews',
      process: [
        'Pay R2500 upfront fee',
        'Receive resume/cover letter support',
        'We submit applications',
        'Pay remaining R2500 after interview'
      ]
    },
    {
      id: 5,
      title: 'Overseas Land Jobs',
      icon: FaGlobe,
      description: 'International job placement and application support',
      packages: [
        {
          name: 'Overseas Land Jobs Package',
          price: 'R2500 + $2000',
          description: 'Complete overseas job application management.',
          features: [
            'Resume creation (R500)',
            'Reference letters (R1000)',
            'Resume submission to recruiters',
            'Interview preparation',
            'R2500 upfront, $2000 after interview'
          ],
          popular: false,
          details: 'Comprehensive support for international job placements. We work with our network of recruiters to find the best opportunities for your skills and experience.'
        }
      ],
      benefits: '70% of clients secured job offers',
      process: [
        'Pay R2500 upfront',
        'Receive reference letter support',
        'We submit to recruiters',
        'Pay $2000 after interview'
      ]
    },
    {
      id: 6,
      title: 'CTRAC Application',
      icon: FaLaptop,
      description: 'Royal Caribbean CTRAC online application assistance',
      packages: [
        {
          name: 'CTRAC Online Application',
          price: 'R350',
          description: 'Assistance for completing Royal Caribbean CTRAC applications.',
          features: [
            'Hands-on application support',
            'Ideal for non-tech-savvy users',
            'Complete form submission',
            'Technical guidance'
          ],
          popular: false,
          details: 'Specialized support for Royal Caribbean\'s CTRAC application system. Perfect for candidates who need assistance navigating the online application process.'
        }
      ],
      benefits: '100% successful application submissions',
      process: [
        'Schedule assistance session',
        'Provide application details',
        'We complete CTRAC form'
      ]
    }
  ];

  const steps = [
    {
      title: 'Choose Your Service',
      description: 'Select the service that best fits your career goals',
      icon: FaUsers
    },
    {
      title: 'Select Your Package',
      description: 'Choose the package that matches your needs and budget',
      icon: FaStar
    },
    {
      title: 'Tell Us About You',
      description: 'Help us understand your background and goals',
      icon: FaHandshake
    },
    {
      title: 'Review & Confirm',
      description: 'Review your selection and complete your purchase',
      icon: FaCreditCard
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedPackage(null);
    setCurrentStep(1);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentStep(2);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePurchase = () => {
    // Here you would integrate with your payment system
    const message = `Hi! I'm interested in the ${selectedService.title} - ${selectedPackage.name} package for R${selectedPackage.price}. My name is ${userInfo.name} and my email is ${userInfo.email}.`;
    const whatsappUrl = `https://wa.me/27612345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      py: 8 
    }}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b', 
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Guided Service Selection
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#64748b', 
              maxWidth: 800, 
              mx: 'auto',
              mb: 4
            }}
          >
            Let us walk you through our services step by step, ensuring you understand exactly what you're purchasing and how it will help you achieve your career goals.
          </Typography>
        </Box>

        {/* Progress Steps */}
        <Box sx={{ mb: 6 }}>
          <Stepper 
            activeStep={currentStep} 
            alternativeLabel
            sx={{ mb: 4 }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel 
                  onClick={() => goToStep(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 1 
              }}
            >
              {steps[currentStep].title}
            </Typography>
            <Typography sx={{ color: '#64748b' }}>
              {steps[currentStep].description}
            </Typography>
          </Box>
        </Box>

        {/* Step Content */}
        <Box>
          {/* Step 1: Service Selection */}
          {currentStep === 0 && (
            <Grid container spacing={3}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      height: '100%',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-2px)'
                      },
                    }}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ 
                        width: 56, 
                        height: 56, 
                        backgroundColor: '#2563eb', 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        mb: 3, 
                        mx: 'auto' 
                      }}>
                        <service.icon style={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          mb: 2, 
                          textAlign: 'center' 
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b', 
                          mb: 3, 
                          textAlign: 'center',
                          flexGrow: 1
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        mt: 'auto' 
                      }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {service.packages.length} package{service.packages.length > 1 ? 's' : ''}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          color: '#2563eb', 
                          fontWeight: 600 
                        }}>
                          <span style={{ marginRight: 4 }}>Learn More</span>
                          <FaArrowRight fontSize="small" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Step 2: Package Selection */}
          {currentStep === 1 && selectedService && (
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                mb: 4
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box sx={{ 
                      width: 64, 
                      height: 64, 
                      backgroundColor: '#2563eb', 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <selectedService.icon style={{ fontSize: 28, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                        {selectedService.title}
                      </Typography>
                      <Typography sx={{ color: '#64748b' }}>
                        {selectedService.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    💡 {selectedService.benefits}
                  </Alert>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {selectedService.packages.map((pkg, index) => (
                  <Grid item xs={12} lg={6} key={index}>
                    <Card
                      sx={{
                        border: selectedPackage === pkg ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: selectedPackage === pkg ? '#eff6ff' : 'white',
                        borderRadius: 2,
                        boxShadow: selectedPackage === pkg ? '0 4px 12px rgba(37, 99, 235, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)'
                        },
                      }}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      {pkg.popular && (
                        <Chip 
                          label="⭐ Most Popular" 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            fontWeight: 600,
                            backgroundColor: '#fef3c7',
                            color: '#92400e'
                          }} 
                        />
                      )}
                      
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                            {pkg.name}
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#2563eb', fontWeight: 600 }}>
                            {pkg.price}
                          </Typography>
                        </Box>
                        
                        <Typography sx={{ color: '#64748b', mb: 3 }}>
                          {pkg.description}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                            What's Included:
                          </Typography>
                          <Stack spacing={1}>
                            {pkg.features.map((feature, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaCheck style={{ color: '#2563eb', fontSize: 14 }} />
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  {feature}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>

                        <Box sx={{ 
                          backgroundColor: '#f8fafc', 
                          borderRadius: 2, 
                          p: 3 
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaInfoCircle style={{ color: '#2563eb', fontSize: 16 }} />
                            Detailed Explanation
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                            {pkg.details}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                mt: 4
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                    How It Works
                  </Typography>
                  <Grid container spacing={3}>
                    {selectedService.process.map((step, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: '#2563eb', 
                            color: 'white', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 600, 
                            fontSize: 14,
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </Box>
                          <Typography sx={{ color: '#64748b', lineHeight: 1.6 }}>
                            {step}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Step 3: User Information */}
          {currentStep === 2 && selectedPackage && (
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, textAlign: 'center' }}>
                    Tell Us About Yourself
                  </Typography>
                  <Typography sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
                    This information helps us provide you with the most personalized and effective service possible.
                  </Typography>
                  
                  <Box component="form" onSubmit={handleUserInfoSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name *"
                          required
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address *"
                          type="email"
                          required
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Current Experience Level</InputLabel>
                          <Select
                            value={userInfo.experience}
                            onChange={(e) => setUserInfo({...userInfo, experience: e.target.value})}
                            label="Current Experience Level"
                          >
                            <MenuItem value="">Select your experience level</MenuItem>
                            <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                            <MenuItem value="mid">Mid Level (3-5 years)</MenuItem>
                            <MenuItem value="senior">Senior Level (5+ years)</MenuItem>
                            <MenuItem value="management">Management Level</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Career Goals"
                          multiline
                          rows={4}
                          value={userInfo.goals}
                          onChange={(e) => setUserInfo({...userInfo, goals: e.target.value})}
                          placeholder="Tell us about your career goals and what you hope to achieve..."
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ 
                        backgroundColor: '#2563eb',
                        '&:hover': {
                          backgroundColor: '#1d4ed8'
                        }
                      }}
                    >
                      Continue to Review
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Step 4: Review and Purchase */}
          {currentStep === 3 && selectedPackage && (
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 4, textAlign: 'center' }}>
                    Review Your Selection
                  </Typography>
                  
                  <Grid container spacing={4}>
                    {/* Order Summary */}
                    <Grid item xs={12} lg={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                        Order Summary
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: '#f8fafc', 
                        borderRadius: 2, 
                        p: 3 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <Box sx={{ 
                            width: 48, 
                            height: 48, 
                            backgroundColor: '#2563eb', 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            <selectedService.icon style={{ fontSize: 20, color: 'white' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {selectedService.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              {selectedPackage.name}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography sx={{ color: '#64748b' }}>
                            Package Price:
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2563eb' }}>
                            {selectedPackage.price}
                          </Typography>
                        </Box>

                        <Alert severity="info">
                          💡 {selectedService.benefits}
                        </Alert>
                      </Box>
                    </Grid>

                    {/* User Information */}
                    <Grid item xs={12} lg={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                        Your Information
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: '#f8fafc', 
                        borderRadius: 2, 
                        p: 3 
                      }}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Name:
                            </Typography>
                            <Typography sx={{ color: '#1e293b' }}>
                              {userInfo.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Email:
                            </Typography>
                            <Typography sx={{ color: '#1e293b' }}>
                              {userInfo.email}
                            </Typography>
                          </Box>
                          {userInfo.phone && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Phone:
                              </Typography>
                              <Typography sx={{ color: '#1e293b' }}>
                                {userInfo.phone}
                              </Typography>
                            </Box>
                          )}
                          {userInfo.experience && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Experience Level:
                              </Typography>
                              <Typography sx={{ color: '#1e293b', textTransform: 'capitalize' }}>
                                {userInfo.experience}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ 
                        mt: 3, 
                        backgroundColor: '#eff6ff', 
                        borderRadius: 2, 
                        p: 3 
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e40af', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaShieldAlt style={{ fontSize: 16 }} />
                          Our Commitment
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>
                          We're committed to transparency and your success. Every step of our process is designed to ensure you understand exactly what you're purchasing and how it will help you achieve your career goals.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={goBack}
                      sx={{ 
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        '&:hover': {
                          borderColor: '#1d4ed8',
                          backgroundColor: '#eff6ff'
                        }
                      }}
                    >
                      <FaArrowLeft style={{ marginRight: 8 }} />
                      Go Back
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handlePurchase}
                      sx={{ 
                        backgroundColor: '#2563eb',
                        '&:hover': {
                          backgroundColor: '#1d4ed8'
                        }
                      }}
                    >
                      <FaWhatsapp style={{ marginRight: 8 }} />
                      Start Your Journey
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Navigation */}
        {currentStep > 0 && currentStep < 3 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={goBack}
              sx={{ 
                borderColor: '#2563eb',
                color: '#2563eb',
                '&:hover': {
                  borderColor: '#1d4ed8',
                  backgroundColor: '#eff6ff'
                }
              }}
            >
              <FaArrowLeft style={{ marginRight: 8 }} />
              Back
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GuidedPurchase; 