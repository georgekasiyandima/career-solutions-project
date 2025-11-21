import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Skeleton, 
  Chip, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Tooltip, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Divider,
  Container,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ChevronLeft, ChevronRight, Share as ShareIcon, Lightbulb, TrendingUp, Psychology, School } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Lazy load async details
const FactDetail = lazy(() => import('./FactDetail'));

const CATEGORY_LABELS = {
  all: 'All',
  modern: 'Modern',
  historical: 'Historical',
  food: 'Food',
  technology: 'Technology',
  engineering: 'Engineering',
  health: 'Health',
  pandemic: 'Pandemic',
};

const DidYouKnow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Mock facts for demo
  const mockFacts = [
    {
      id: 1,
      heading: "Career Growth Mindset",
      text: "Professionals with a growth mindset are 47% more likely to achieve career advancement within 2 years compared to those with a fixed mindset.",
      category: "modern",
      image: "/images/career-growth.jpg"
    },
    {
      id: 2,
      heading: "Networking Impact",
      text: "85% of job opportunities are filled through networking, not traditional job applications. Building professional relationships is key to career success.",
      category: "modern",
      image: "/images/networking.jpg"
    },
    {
      id: 3,
      heading: "Skill Development",
      text: "Learning new skills can increase your earning potential by up to 25%. Continuous learning is essential in today's rapidly evolving job market.",
      category: "technology",
      image: "/images/skills.jpg"
    },
    {
      id: 4,
      heading: "International Experience",
      text: "Professionals with international experience earn 20% more on average and have better career advancement opportunities.",
      category: "modern",
      image: "/images/international.jpg"
    },
    {
      id: 5,
      heading: "Interview Preparation",
      text: "Candidates who practice interview questions out loud are 3x more likely to receive job offers compared to those who only think through answers.",
      category: "modern",
      image: "/images/interview.jpg"
    }
  ];

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFacts(mockFacts);
      } catch (err) {
        setError('Failed to load facts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, []);

  // Filter facts by category
  const filteredFacts = useMemo(() =>
    category === 'all' ? (facts || []) : (facts || []).filter(f => f.category === category),
    [category, facts]
  );

  // Reset index if filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [category]);

  // Auto-advance
  useEffect(() => {
    if (filteredFacts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredFacts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [filteredFacts.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredFacts.length) % filteredFacts.length);
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredFacts.length);
  };

  const handleShare = async () => {
    const fact = filteredFacts[currentIndex];
    try {
      await navigator.clipboard.writeText(`${fact.heading}\n${fact.text}`);
      setSnackbarMsg('Fact copied to clipboard!');
      setShowSnackbar(true);
    } catch {
      setSnackbarMsg('Failed to copy.');
      setShowSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        py: 6, 
        background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={40} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        py: 6, 
        background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
      }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Container>
      </Box>
    );
  }

  if (filteredFacts.length === 0) {
    return (
      <Box sx={{ 
        py: 6, 
        background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No facts available for this category.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  const currentFact = filteredFacts[currentIndex];

  return (
    <Box sx={{ 
      py: 6, 
      background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Lightbulb sx={{ 
              fontSize: 40, 
              color: theme.palette.secondary.main, 
              mr: 2 
            }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              Did You Know?
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.1rem',
              fontFamily: '"Josefin Sans", sans-serif',
            }}
          >
            Discover fascinating insights about career development, job markets, and professional growth
          </Typography>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            flexWrap="wrap"
            useFlexGap
          >
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                onClick={() => setCategory(key)}
                variant={category === key ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: category === key ? theme.palette.primary.main : 'transparent',
                  color: category === key ? 'white' : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: category === key ? theme.palette.primary.dark : 'rgba(26, 95, 122, 0.08)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Fact Display */}
        <Box sx={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                  {/* Image Section */}
                  <Box sx={{ 
                    width: { xs: '100%', md: '40%' }, 
                    minHeight: { xs: 200, md: 300 },
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <Box sx={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(0, 184, 148, 0.3)',
                    }}>
                      <InfoOutlinedIcon sx={{ fontSize: 48, color: 'white' }} />
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box sx={{ 
                    flex: 1, 
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme.palette.primary.main,
                        lineHeight: 1.3,
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {currentFact.heading}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                        mb: 3,
                        fontSize: '1.1rem',
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {currentFact.text}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={CATEGORY_LABELS[currentFact.category] || currentFact.category}
                        size="small"
                        sx={{
                          bgcolor: `${theme.palette.secondary.main}20`,
                          color: theme.palette.secondary.main,
                          fontWeight: 600,
                        }}
                      />
                      <Tooltip title="Share this fact">
                        <IconButton
                          onClick={handleShare}
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 3, 
            gap: 2 
          }}>
            <IconButton
              onClick={handlePrevious}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {filteredFacts.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === currentIndex ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
            
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DidYouKnow;