import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Stack, 
  Divider,
  useTheme,
  Alert
} from '@mui/material';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaArrowRight, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { apiService } from '../../config/api';

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email.trim()) {
      setMessage('Please enter your email address.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await apiService.subscribe({ email });
      setMessage(data.message);
      setMessageType(data.success ? 'success' : 'error');
      if (data.success) {
        setEmail('');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNewsletterSubmit(e);
    }
  };

  const socialLinks = [
    { icon: FaLinkedin, href: 'https://linkedin.com/company/gbjobmarket', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/gbjobmarket', label: 'Twitter' },
    { icon: FaFacebook, href: 'https://facebook.com/gbjobmarket', label: 'Facebook' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
    { icon: FaWhatsapp, href: 'https://wa.me/27749998812', label: 'WhatsApp' }
  ];

  const quickLinks = [
    { to: '/services', label: 'Our Services' },
    { to: '/jobs', label: 'Job Opportunities' },
    { to: '/about-us', label: 'About Us' },
    { to: '/success-stories', label: 'Success Stories' },
    { to: '/faq', label: 'FAQ' },
    { to: '/enquiry', label: 'Contact Us' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0B444A',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
              Career Solutions
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)', fontFamily: '"Josefin Sans", sans-serif' }}>
              Empowering candidates to achieve their career goals through professional guidance, 
              job placement services, and comprehensive career development support.
            </Typography>
            <Stack direction="row" spacing={2}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff', fontFamily: '"Josefin Sans", sans-serif' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff', fontFamily: '"Josefin Sans", sans-serif' }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)', fontFamily: '"Josefin Sans", sans-serif' }}>
              Get the latest job opportunities and career tips delivered to your inbox.
            </Typography>
            
            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0B444A',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0B444A',
                      },
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#0B444A',
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>

            {message && (
              <Alert severity={messageType} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: '"Josefin Sans", sans-serif' }}>
            © {new Date().getFullYear()} Career Solutions. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={3}>
            <Link
              to="/privacy"
              style={{
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem',
                fontFamily: '"Josefin Sans", sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              style={{
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem',
                fontFamily: '"Josefin Sans", sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;