'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { FormatQuote, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
  },
}));

const TestimonialsCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Cruise Ship Manager',
      company: 'Royal Caribbean',
      image: '/images/Daniel.webp',
      rating: 5,
      text: 'Career Solutions helped me land my dream job on a cruise ship. Their guidance was invaluable, and I\'m now working my way up the ranks. Highly recommended!',
      location: 'Cape Town, South Africa',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Logistics Coordinator',
      company: 'International Shipping Co.',
      image: '/images/Ernest.webp',
      rating: 5,
      text: 'The international resume service was outstanding. I received multiple job offers within weeks. The team\'s expertise in global markets is unmatched.',
      location: 'Johannesburg, South Africa',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Hospitality Supervisor',
      company: 'Disney Cruise Line',
      image: '/images/Tinashe.webp',
      rating: 5,
      text: 'From application to placement, Career Solutions supported me every step of the way. I\'m now living my dream of traveling the world while working.',
      location: 'Durban, South Africa',
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Marine Engineer',
      company: 'Norwegian Cruise Line',
      image: '/images/Nathaniel.webp',
      rating: 5,
      text: 'The Complete Career Package was worth every penny. The ongoing support and hiring manager contacts made all the difference in my job search.',
      location: 'Port Elizabeth, South Africa',
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
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
            What Our Clients Say
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
            Real stories from professionals who transformed their careers with us.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 900, mx: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <StyledCard>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <FormatQuote
                    sx={{
                      fontSize: 48,
                      color: '#667eea',
                      opacity: 0.2,
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Rating value={currentTestimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#334155',
                        fontSize: { xs: '1rem', md: '1.15rem' },
                        lineHeight: 1.8,
                        fontStyle: 'italic',
                        mb: 3,
                      }}
                    >
                      "{currentTestimonial.text}"
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    sx={{
                      width: 64,
                      height: 64,
                      border: '3px solid #667eea',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0B444A',
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {currentTestimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94a3b8',
                      }}
                    >
                      {currentTestimonial.location}
                    </Typography>
                  </Box>
                </Box>
              </StyledCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  sx={{
                    width: currentIndex === index ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      currentIndex === index ? '#667eea' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#667eea',
                      width: 24,
                    },
                  }}
                />
              ))}
            </Box>

            <IconButton
              onClick={handleNext}
              sx={{
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsCarousel;

