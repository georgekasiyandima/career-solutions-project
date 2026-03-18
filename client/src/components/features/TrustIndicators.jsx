'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Verified,
  Security,
  GppGood,
  WorkspacePremium,
  Business,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const TrustIndicators = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const indicators = [
    {
      icon: <Verified sx={{ fontSize: 40 }} />,
      title: 'Verified Service Provider',
      description: 'Certified and trusted by industry professionals',
      color: '#059669',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Confidential',
      description: 'Your data is protected with industry-standard security',
      color: '#2563eb',
    },
    {
      icon: <GppGood sx={{ fontSize: 40 }} />,
      title: 'Money-Back Guarantee',
      description: 'Satisfaction guaranteed or your money back',
      color: '#dc2626',
    },
    {
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      title: 'Premium Quality',
      description: 'Award-winning resume and career services',
      color: '#7c3aed',
    },
    {
      icon: <Business sx={{ fontSize: 40 }} />,
      title: 'Industry Partnerships',
      description: 'Connected with top employers worldwide',
      color: '#ea580c',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Proven Track Record',
      description: '95% success rate with 500+ placements',
      color: '#0891b2',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Why Choose Career Solutions
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
            We're committed to your success with industry-leading standards and proven results.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Grid container spacing={3}>
            {indicators.map((indicator, index) => (
              <Grid item xs={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        '& .indicator-icon': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <Box
                      className="indicator-icon"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: `${indicator.color}15`,
                        color: indicator.color,
                        mb: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {indicator.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0B444A',
                        mb: 1,
                        fontFamily: '"Josefin Sans", sans-serif',
                        fontSize: { xs: '1rem', md: '1.15rem' },
                      }}
                    >
                      {indicator.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                      }}
                    >
                      {indicator.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TrustIndicators;

