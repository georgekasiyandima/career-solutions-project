'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme, 
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

const HeroSection = () => {
  const router = useRouter();
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = useCallback(() => {
    router.push('/enquiry');
  }, [router]);

  const handleViewJobs = useCallback(() => {
    router.push('/jobs');
  }, [router]);

  return (
    <Box
      sx={{
        backgroundColor: '#0B444A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/GBCS1.mp4" type="video/mp4" />
      </Box>
      
      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(11, 68, 74, 0.85) 0%, rgba(19, 72, 76, 0.75) 100%)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: { xs: 8, md: 12 },
          }}
        >
          {/* Main Heading with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                fontWeight: 700,
                color: '#ffffff',
                mb: 3,
                lineHeight: 1.1,
                fontFamily: '"Josefin Sans", sans-serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Find Your Dream
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                style={{ color: '#EAEBF0', display: 'block' }}
              >
                Career Abroad
              </motion.span>
            </Typography>
          </motion.div>

          {/* Subtitle with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 4,
                maxWidth: '700px',
                fontWeight: 400,
                lineHeight: 1.6,
                fontFamily: '"Josefin Sans", sans-serif',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
              }}
            >
              Connect with global opportunities in cruise ships, logistics, and international markets. 
              Professional guidance to launch your international career.
            </Typography>
          </motion.div>

          {/* CTA Buttons with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    backgroundColor: '#0B444A',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: '"Josefin Sans", sans-serif',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(11, 68, 74, 0.4)',
                    '&:hover': {
                      backgroundColor: '#0F464B',
                      boxShadow: '0 6px 16px rgba(11, 68, 74, 0.5)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleViewJobs}
                  sx={{
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: '#EAEBF0',
                      borderWidth: 2,
                    },
                  }}
                >
                  View Jobs
                </Button>
              </motion.div>
            </Stack>
          </motion.div>

          {/* Stats with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 3, md: 6 },
                mt: 4,
              }}
            >
              <VisibilitySensor active={isVisible} delayedCall>
                {({ isVisible: isStatVisible }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#ffffff',
                            mb: 0.5,
                            fontFamily: '"Josefin Sans", sans-serif',
                            textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {isStatVisible ? (
                            <CountUp end={500} duration={2.5} suffix="+" />
                          ) : (
                            '0+'
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            fontFamily: '"Josefin Sans", sans-serif',
                          }}
                        >
                          Successful Placements
                        </Typography>
                      </Box>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#ffffff',
                            mb: 0.5,
                            fontFamily: '"Josefin Sans", sans-serif',
                            textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {isStatVisible ? (
                            <CountUp end={50} duration={2.5} suffix="+" />
                          ) : (
                            '0+'
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            fontFamily: '"Josefin Sans", sans-serif',
                          }}
                        >
                          Partner Companies
                        </Typography>
                      </Box>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#ffffff',
                            mb: 0.5,
                            fontFamily: '"Josefin Sans", sans-serif',
                            textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {isStatVisible ? (
                            <CountUp end={95} duration={2.5} suffix="%" />
                          ) : (
                            '0%'
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            fontFamily: '"Josefin Sans", sans-serif',
                          }}
                        >
                          Success Rate
                        </Typography>
                      </Box>
                    </motion.div>
                  </>
                )}
              </VisibilitySensor>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;