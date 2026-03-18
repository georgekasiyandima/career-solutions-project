'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FaFileAlt,
  FaEnvelope,
  FaPassport,
  FaShip,
  FaGlobe,
  ArrowForward,
  Star,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    '& .service-icon': {
      transform: 'scale(1.1) rotate(5deg)',
    },
    '& .service-button': {
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
      transform: 'translateX(4px)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme, gradient }) => ({
  width: 80,
  height: 80,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: gradient,
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
}));

const FeaturedServices = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const services = [
    {
      id: 'resume',
      icon: FaFileAlt,
      title: 'Resume Services',
      description: 'Professional, ATS-compliant resumes tailored for local and international markets.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      features: ['Local & International', 'ATS-Optimized', '3 Revisions'],
      popular: false,
    },
    {
      id: 'career-package',
      icon: FaGlobe,
      title: 'Complete Career Package',
      description: 'Comprehensive support with ongoing guidance throughout your job search journey.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      features: ['Resume + Updates', 'Hiring Manager Contacts', 'Interview Prep', 'Ongoing Support'],
      popular: true,
    },
    {
      id: 'cruise',
      icon: FaShip,
      title: 'Cruise Ship Careers',
      description: 'Specialized placement services for cruise ship positions worldwide.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      features: ['Global Opportunities', 'Multiple Cruise Lines', 'Career Growth'],
      popular: false,
    },
    {
      id: 'international',
      icon: FaPassport,
      title: 'International Placements',
      description: 'Connect with opportunities across 30+ countries in various industries.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      features: ['30+ Countries', 'Multiple Industries', 'Visa Support'],
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="Our Services"
            sx={{
              backgroundColor: 'rgba(11, 68, 74, 0.1)',
              color: '#0B444A',
              fontWeight: 600,
              mb: 2,
              px: 1,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#0B444A',
              mb: 2,
              fontFamily: '"Josefin Sans", sans-serif',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            How We Help You Succeed
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
            }}
          >
            From resume writing to international placements, we provide comprehensive career solutions.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={service.id}>
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    {service.popular && (
                      <Chip
                        label="Most Popular"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: '#f5576c',
                          color: '#ffffff',
                          fontWeight: 600,
                          zIndex: 1,
                          boxShadow: '0 4px 8px rgba(245, 87, 108, 0.3)',
                        }}
                        icon={<Star style={{ fontSize: 14 }} />}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <IconWrapper className="service-icon" gradient={service.gradient}>
                        <service.icon
                          style={{
                            fontSize: 32,
                            color: '#ffffff',
                          }}
                        />
                      </IconWrapper>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#0B444A',
                          mb: 1.5,
                          fontFamily: '"Josefin Sans", sans-serif',
                          fontSize: { xs: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: { xs: '0.9rem', md: '1rem' },
                        }}
                      >
                        {service.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              backgroundColor: 'rgba(11, 68, 74, 0.08)',
                              color: '#0B444A',
                              fontSize: '0.75rem',
                            }}
                          />
                        ))}
                      </Box>
                      <Button
                        className="service-button"
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowForward />}
                        onClick={() => router.push('/services')}
                        sx={{
                          borderColor: '#0B444A',
                          color: '#0B444A',
                          fontWeight: 600,
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FeaturedServices;

