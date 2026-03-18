'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email, Send, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(4, 3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const NewsletterSignup = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual API endpoint
    try {
      // await apiService.post('/newsletter/subscribe', { email });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <StyledBox sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
              <Email
                sx={{
                  fontSize: 48,
                  color: '#ffffff',
                  mb: 2,
                  opacity: 0.9,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#ffffff',
                  mb: 2,
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                }}
              >
                Stay Updated with Latest Opportunities
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                }}
              >
                Get job alerts, career tips, and exclusive opportunities delivered to your inbox.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 2 }}>
              {status === 'success' && (
                <Alert
                  icon={<CheckCircle />}
                  severity="success"
                  sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                  Thank you! You've been successfully subscribed.
                </Alert>
              )}
              {status === 'error' && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                  Please enter a valid email address.
                </Alert>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: '#64748b' }} />
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<Send />}
                  sx={{
                    backgroundColor: '#0B444A',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: '"Josefin Sans", sans-serif',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: '#0F464B',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Box>
            </Box>
          </StyledBox>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NewsletterSignup;

