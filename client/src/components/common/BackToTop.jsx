import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 30 },
          right: { xs: 20, sm: 30 },
          zIndex: 1000,
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          },
        }}
        aria-label="Back to top"
      >
        <FaArrowUp size={20} />
      </Fab>
    </Zoom>
  );
};

export default BackToTop;




