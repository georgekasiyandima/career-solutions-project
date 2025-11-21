import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import StoryCard from './StoryCard';

const SuccessStoriesList = ({ stories, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <CircularProgress sx={{ color: '#4CAF50', size: 60 }} />
        <Typography variant="h6" sx={{ color: '#495057', mt: 3, fontWeight: 'medium' }}>
          Loading inspiring stories...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 8, fontSize: '1.1rem' }}>
        {error}
      </Alert>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 8, fontSize: '1.1rem' }}>
        No success stories available at the moment.
      </Alert>
    );
  }

  return (
    <Grid container spacing={4}>
      {stories.map((story, index) => (
        <Grid item xs={12} md={6} lg={4} key={story.id}>
          <StoryCard 
            story={story} 
            sx={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SuccessStoriesList; 