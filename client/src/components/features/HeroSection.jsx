import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme, 
  Stack
} from '@mui/material';

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = useCallback(() => {
    navigate('/enquiry');
  }, [navigate]);

  const handleViewJobs = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

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
          {/* Main Heading */}
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
            <Box component="span" sx={{ color: '#EAEBF0', display: 'block' }}>
              Career Abroad
            </Box>
          </Typography>

          {/* Subtitle */}
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

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 6 }}
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
          </Stack>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 3, md: 6 },
              mt: 4,
            }}
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
                500+
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
                50+
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
                95%
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;