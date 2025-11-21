import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  TrendingUp,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A3C34 0%, #4CAF50 100%)',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-12px) rotate(1deg)',
    boxShadow: theme.shadows[25],
    '& .story-image': {
      transform: 'scale(1.1)',
    },
    '& .story-content': {
      background: 'rgba(26, 60, 52, 0.95)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.4s ease-in-out',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const StoryCard = ({ story }) => {
  return (
    <StyledCard elevation={8}>
      <Box
        className="story-image"
        sx={{
          height: 220,
          background: `linear-gradient(45deg, rgba(26, 60, 52, 0.9), rgba(76, 175, 80, 0.9)), url(${story.photo_url || '/images/default-user.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          transition: 'transform 0.4s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            p: 1.5,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          <CheckCircle sx={{ color: '#4CAF50', fontSize: 28 }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.1,
          }}
        >
          <Typography variant="h1" sx={{ color: 'white', fontSize: '4rem' }}>
            "
          </Typography>
        </Box>
      </Box>

      <CardContent
        className="story-content"
        sx={{
          p: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1A3C34 0%, #4CAF50 100%)',
          transition: 'background 0.4s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={story.photo_url || '/images/default-user.png'}
            alt={story.name || 'Success Story'}
            sx={{
              width: 70,
              height: 70,
              mr: 3,
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 0.5,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              {story.name || 'Anonymous'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                opacity: 0.9,
                fontWeight: 'medium',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              {story.role || 'Role'} at {story.company || 'Company'}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: 'white',
            mb: 4,
            fontStyle: 'italic',
            lineHeight: 1.7,
            opacity: 0.95,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          "{story.testimonial || 'No testimonial provided.'}"
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
          <Chip
            icon={<LocationOn sx={{ fontSize: 18 }} />}
            label={story.location || 'Location'}
            size="medium"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontWeight: 'medium',
              fontSize: '0.9rem',
              '& .MuiChip-icon': { color: '#4CAF50' },
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Chip
            icon={<CalendarToday sx={{ fontSize: 18 }} />}
            label={story.hired_date ? new Date(story.hired_date).toLocaleDateString() : 'Unknown'}
            size="medium"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontWeight: 'medium',
              fontSize: '0.9rem',
              '& .MuiChip-icon': { color: '#4CAF50' },
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          {story.salary && (
            <Chip
              icon={<TrendingUp sx={{ fontSize: 18 }} />}
              label={story.salary}
              size="medium"
              sx={{
                bgcolor: 'rgba(76, 175, 80, 0.25)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                '& .MuiChip-icon': { color: 'white' },
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            />
          )}
        </Box>

        <Button
          component={Link}
          to="/booking"
          variant="contained"
          fullWidth
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: 'white',
            color: '#1A3C34',
            fontWeight: 'bold',
            py: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1.1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '&:hover': {
              bgcolor: '#f8f9fa',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            },
          }}
        >
          Start Your Success Story
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default StoryCard; 