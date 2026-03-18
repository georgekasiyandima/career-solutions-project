'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { TrendingUp, People, Business, EmojiEvents, FlightTakeoff, Star } from '@mui/icons-material';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { motion, useInView } from 'framer-motion';

const AnimatedStats = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      value: 500,
      suffix: '+',
      label: 'Successful Placements',
      color: '#2563eb',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <Business sx={{ fontSize: 40 }} />,
      value: 50,
      suffix: '+',
      label: 'Partner Companies',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      icon: <FlightTakeoff sx={{ fontSize: 40 }} />,
      value: 30,
      suffix: '+',
      label: 'Countries',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
    {
      icon: <Star sx={{ fontSize: 40 }} />,
      value: 4.8,
      suffix: '/5',
      label: 'Client Rating',
      color: '#ea580c',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      value: 85,
      suffix: '%',
      label: 'Career Growth',
      color: '#0891b2',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
    hidden: { opacity: 0, y: 20 },
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
      ref={ref}
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(11, 68, 74, 0.02) 0%, transparent 100%)',
          pointerEvents: 'none',
        },
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
            Our Impact in Numbers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
            }}
          >
            Trusted by thousands of professionals worldwide. See how we're transforming careers.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: stat.gradient,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                        '& .stat-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      },
                    }}
                  >
                    <Box
                      className="stat-icon"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: stat.gradient,
                        color: '#ffffff',
                        mb: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <VisibilitySensor active={isInView} delayedCall>
                      {({ isVisible }) => (
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: '#0B444A',
                            mb: 1,
                            fontFamily: '"Josefin Sans", sans-serif',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                          }}
                        >
                          {isVisible ? (
                            <CountUp
                              end={stat.value}
                              duration={2.5}
                              decimals={stat.value % 1 !== 0 ? 1 : 0}
                              separator=","
                            />
                          ) : (
                            '0'
                          )}
                          {stat.suffix}
                        </Typography>
                      )}
                    </VisibilitySensor>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', md: '1rem' },
                      }}
                    >
                      {stat.label}
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

export default AnimatedStats;

