import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Paper,
  Stack,
  Alert
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Favorite as HeartIcon,
  Public as GlobeIcon,
  Work as WorkIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const ClientSuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: HeartIcon, count: 12, color: '#f44336' },
    { id: 'cruise', name: 'Cruise Ship Jobs', icon: WorkIcon, count: 5, color: '#2196f3' },
    { id: 'overseas', name: 'Overseas Jobs', icon: GlobeIcon, count: 4, color: '#4caf50' },
    { id: 'visa', name: 'Visa Success', icon: WorkIcon, count: 3, color: '#ff9800' }
  ];

  const successStories = [
    {
      id: 1,
      name: 'Sarah M.',
      category: 'cruise',
      service: 'Cruise Ship Application Package',
      before: {
        situation: 'Working as a waitress in a local restaurant',
        income: 'R3,500/month',
        location: 'Cape Town, South Africa',
        challenges: ['Limited career growth', 'Low income', 'No international experience']
      },
      after: {
        position: 'Assistant Waiter',
        company: 'Royal Caribbean International',
        income: '$1,800/month + tips',
        location: 'Caribbean & Mediterranean',
        achievements: ['First time on a plane', 'International work experience', 'Saving for family']
      },
      testimonial: "I never thought I'd work on a cruise ship! Career Solutions made it possible. Now I'm traveling the world, earning good money, and supporting my family back home. This changed everything for us.",
      duration: '3 months from application to job',
      impact: 'Family income increased by 400%',
      tags: ['First-time traveler', 'Family support', 'Career transformation']
    },
    {
      id: 2,
      name: 'David K.',
      category: 'overseas',
      service: 'Overseas Land Jobs Package',
      before: {
        situation: 'Unemployed for 8 months',
        income: 'R0/month',
        location: 'Johannesburg, South Africa',
        challenges: ['Long-term unemployment', 'No savings', 'Losing hope']
      },
      after: {
        position: 'Construction Supervisor',
        company: 'Construction Company Ltd',
        income: '£2,500/month',
        location: 'London, United Kingdom',
        achievements: ['Stable income', 'Professional growth', 'International experience']
      },
      testimonial: "After 8 months of unemployment, I was losing hope. Career Solutions didn't just find me a job - they found me a career. Now I'm building a future for my family in the UK.",
      duration: '4 months from application to job',
      impact: 'From unemployed to £30,000/year salary',
      tags: ['Career restart', 'International move', 'Family stability']
    }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === selectedCategory);

  const handleStorySelect = (story) => {
    setSelectedStory(story);
  };

  const closeModal = () => {
    setSelectedStory(null);
  };

  const shareStory = (story) => {
    const message = `Check out this amazing success story from Career Solutions! ${story.name} went from ${story.before.situation} to ${story.after.position} at ${story.after.company}. #ChangingLives #CareerSolutions`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const stats = [
    { number: '1000+', label: 'Lives Changed', icon: HeartIcon, color: '#f44336' },
    { number: '80%+', label: 'Success Rate', icon: StarIcon, color: '#ff9800' },
    { number: '12', label: 'Countries', icon: GlobeIcon, color: '#2196f3' },
    { number: 'R2.5M+', label: 'Income Generated', icon: MoneyIcon, color: '#4caf50' }
  ];

  return (
    <Box sx={{ 
      py: 12, 
      px: { xs: 2, sm: 4 }, 
      pt: 16, 
      background: 'linear-gradient(135deg, #004d40 0%, #2E7D32 100%)', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="lg">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="#ChangingLives"
              sx={{
                background: 'linear-gradient(90deg, #ff9800, #f44336)',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: 700,
                mb: 3,
                px: 3,
                py: 1
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                color: 'white', 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Success Stories
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                maxWidth: 800, 
                mx: 'auto', 
                lineHeight: 1.5,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Real stories of transformation, hope, and new beginnings. Every number represents a life changed, 
              a family supported, and a future built through our commitment to service excellence.
            </Typography>
          </Box>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <stat.icon sx={{ fontSize: 32, color: 'white' }} />
                  </Avatar>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white', 
                      mb: 1,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "contained" : "outlined"}
                startIcon={<category.icon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  ...(selectedCategory === category.id && {
                    background: 'linear-gradient(135deg, #4caf50, #2E7D32)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2E7D32, #4caf50)',
                    }
                  }),
                  ...(selectedCategory !== category.id && {
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                    }
                  })
                }}
              >
                {category.name}
                <Chip
                  label={category.count}
                  size="small"
                  sx={{
                    ml: 1,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
              </Button>
            ))}
          </Box>
        </motion.div>

        {/* Success Stories Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <AnimatePresence mode="wait">
            {filteredStories.map((story, index) => (
              <Grid item xs={12} sm={6} lg={4} key={story.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.15)',
                        borderColor: 'rgba(255,255,255,0.3)',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                      }
                    }}
                    onClick={() => handleStorySelect(story)}
                  >
                    {/* Story Image */}
                    <Box
                      sx={{
                        height: 200,
                        background: 'linear-gradient(135deg, #4caf50, #004d40)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              background: 'rgba(255,255,255,0.2)',
                              mx: 'auto',
                              mb: 1
                            }}
                          >
                            <PlayIcon sx={{ fontSize: 32 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                            Watch Story
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Story Content */}
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontFamily: 'Poppins, sans-serif' }}>
                          {story.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} sx={{ color: '#ff9800', fontSize: 16 }} />
                          ))}
                        </Box>
                      </Box>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.8)', 
                          mb: 3, 
                          lineHeight: 1.5,
                          fontFamily: 'Poppins, sans-serif',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        "{story.testimonial.substring(0, 120)}..."
                      </Typography>

                      <Stack spacing={1} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {story.after.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {story.after.income}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                          <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {story.duration}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        {story.tags.slice(0, 2).map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.3)',
                              fontSize: '0.75rem',
                              fontFamily: 'Poppins, sans-serif'
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Paper
            sx={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
              Ready to Write Your Success Story?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 600, mx: 'auto', fontFamily: 'Poppins, sans-serif' }}>
              Join the hundreds of clients who have transformed their lives through our services. 
              Your success story could be next!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                href="/guided-purchase"
                variant="contained"
                startIcon={<TrendingIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #4caf50, #2E7D32)',
                  color: 'white',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2E7D32, #4caf50)',
                  }
                }}
              >
                Start Your Journey
              </Button>
              <Button
                href="/services"
                variant="outlined"
                startIcon={<WorkIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Explore Services
              </Button>
            </Stack>
          </Paper>
        </motion.div>

        {/* Story Detail Modal */}
        <Dialog
          open={!!selectedStory}
          onClose={closeModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh'
            }
          }}
        >
          {selectedStory && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                      {selectedStory.name}'s Success Story
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'Poppins, sans-serif' }}>
                      {selectedStory.service}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => shareStory(selectedStory)}>
                      <ShareIcon />
                    </IconButton>
                    <IconButton onClick={closeModal}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Alert severity="success" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  💡 {selectedStory.impact}
                </Alert>
              </DialogTitle>

              <DialogContent>
                <Grid container spacing={4}>
                  
                  {/* Before & After */}
                  <Grid item xs={12} lg={6}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, fontFamily: 'Poppins, sans-serif' }}>
                      The Transformation
                    </Typography>
                    
                    <Stack spacing={3}>
                      {/* Before */}
                      <Paper sx={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: 2, p: 3 }}>
                        <Typography variant="h6" sx={{ color: '#c62828', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                          Before Career Solutions
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#c62828', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Situation:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d32f2f', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.before.situation}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#c62828', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Income:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d32f2f', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.before.income}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#c62828', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Location:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d32f2f', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.before.location}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {/* After */}
                      <Paper sx={{ background: '#e8f5e8', border: '1px solid #c8e6c9', borderRadius: 2, p: 3 }}>
                        <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                          After Career Solutions
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Position:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.after.position}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Company:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.after.company}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Income:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.after.income}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                              Location:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}>
                              {selectedStory.after.location}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>

                  {/* Testimonial */}
                  <Grid item xs={12} lg={6}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, fontFamily: 'Poppins, sans-serif' }}>
                      In Their Own Words
                    </Typography>
                    
                    <Paper sx={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 2, p: 3 }}>
                      <Typography variant="body1" sx={{ color: '#1565c0', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>
                        "{selectedStory.testimonial}"
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                            {selectedStory.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#42a5f5', fontFamily: 'Poppins, sans-serif' }}>
                            {selectedStory.after.position} at {selectedStory.after.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} sx={{ color: '#ff9800' }} />
                          ))}
                        </Box>
                      </Box>
                    </Paper>

                    {/* Tags */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                        Key Highlights
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {selectedStory.tags.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            sx={{
                              background: 'rgba(76, 175, 80, 0.2)',
                              color: '#2e7d32',
                              fontFamily: 'Poppins, sans-serif'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default ClientSuccessStories; 