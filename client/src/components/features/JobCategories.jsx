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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DirectionsBoat,
  LocalShipping,
  Hotel,
  Restaurant,
  Engineering,
  BusinessCenter,
  School,
  HealthAndSafety,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12)',
    '& .category-icon': {
      transform: 'scale(1.15) rotate(5deg)',
    },
    '& .category-count': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const JobCategories = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    {
      id: 'cruise',
      icon: DirectionsBoat,
      title: 'Cruise Ships',
      count: 120,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Hospitality, entertainment, and service roles',
    },
    {
      id: 'logistics',
      icon: LocalShipping,
      title: 'Logistics & Shipping',
      count: 85,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Warehouse, distribution, and supply chain',
    },
    {
      id: 'hospitality',
      icon: Hotel,
      title: 'Hospitality',
      count: 95,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Hotels, resorts, and tourism',
    },
    {
      id: 'culinary',
      icon: Restaurant,
      title: 'Culinary Arts',
      count: 70,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Chefs, cooks, and kitchen staff',
    },
    {
      id: 'engineering',
      icon: Engineering,
      title: 'Engineering',
      count: 60,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Marine, mechanical, and technical',
    },
    {
      id: 'business',
      icon: BusinessCenter,
      title: 'Business & Finance',
      count: 45,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      description: 'Management and financial roles',
    },
    {
      id: 'education',
      icon: School,
      title: 'Education',
      count: 30,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      description: 'Teaching and training positions',
    },
    {
      id: 'healthcare',
      icon: HealthAndSafety,
      title: 'Healthcare',
      count: 55,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      description: 'Medical and wellness professionals',
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
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f8fafc',
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
            Explore Job Categories
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
            Discover opportunities across diverse industries and find your perfect career match.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={category.id}>
                <motion.div variants={itemVariants}>
                  <StyledCard onClick={() => router.push('/jobs')}>
                    <CardContent
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: 200,
                      }}
                    >
                      <Box
                        className="category-icon"
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: category.gradient,
                          mb: 2,
                          transition: 'transform 0.3s ease',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <category.icon
                          sx={{
                            fontSize: 40,
                            color: '#ffffff',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#0B444A',
                          mb: 1,
                          fontFamily: '"Josefin Sans", sans-serif',
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        className="category-count"
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          mb: 1.5,
                          opacity: 0.8,
                          transform: 'translateY(-4px)',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                        }}
                      >
                        {category.count}+ Open Positions
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#94a3b8',
                          fontSize: '0.8rem',
                          mb: 2,
                        }}
                      >
                        {category.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/jobs')}
            sx={{
              backgroundColor: '#0B444A',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: '"Josefin Sans", sans-serif',
              '&:hover': {
                backgroundColor: '#0F464B',
              },
            }}
          >
            View All Jobs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobCategories;

