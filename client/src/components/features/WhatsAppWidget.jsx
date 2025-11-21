import React from 'react';
import { Box, Fab, Tooltip, Zoom } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const whatsappNumber = '+27749998812';
const whatsappMessage = "Hi, I'd like to inquire about career consultation services.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

const AnimatedFab = styled(Fab)(({ theme }) => ({
  backgroundColor: '#25D366',
  color: '#fff',
  width: 56,
  height: 56,
  boxShadow: theme.shadows[6],
  animation: `${pulse} 1.8s infinite`,
  '&:hover': {
    backgroundColor: '#1EBE54',
  },
}));

const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path d="M16 6.5c-5.24 0-9.5 4.26-9.5 9.5 0 1.67.44 3.29 1.28 4.72l-1.36 4.98a1 1 0 001.23 1.23l4.98-1.36A9.47 9.47 0 0016 25.5c5.24 0 9.5-4.26 9.5-9.5s-4.26-9.5-9.5-9.5zm0 17.5a7.47 7.47 0 01-4.01-1.17l-.29-.18-2.96.81.81-2.96-.18-.29A7.48 7.48 0 1123.5 16c0 4.14-3.36 7.5-7.5 7.5zm4.13-5.62c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.28-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.29-.01-.45-.01-.15 0-.41.06-.62.29-.21.23-.81.79-.81 1.93 0 1.14.83 2.24.95 2.4.12.15 1.63 2.5 3.95 3.4.55.19.98.3 1.31.38.55.14 1.05.12 1.44.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.15-.44-.27z" fill="#fff" />
  </svg>
);

const WhatsAppWidget = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: { xs: 20, sm: 32 },
      right: { xs: 20, sm: 32 },
      zIndex: 1300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}
  >
    <Tooltip
      title="Chat with us on WhatsApp!"
      placement="left"
      arrow
      TransitionComponent={Zoom}
    >
      <AnimatedFab
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon />
      </AnimatedFab>
    </Tooltip>
  </Box>
);

export default WhatsAppWidget;