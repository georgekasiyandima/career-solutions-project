import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const SocialIcons = () => {
  const theme = useTheme();

  const socialLinks = [
    { 
      icon: FaLinkedin, 
      href: 'https://linkedin.com/company/gbjobmarket', 
      label: 'LinkedIn',
      color: '#0077b5'
    },
    { 
      icon: FaTwitter, 
      href: 'https://twitter.com/gbjobmarket', 
      label: 'Twitter',
      color: '#1DA1F2'
    },
    { 
      icon: FaFacebook, 
      href: 'https://facebook.com/gbjobmarket', 
      label: 'Facebook',
      color: '#1877F2'
    },
    { 
      icon: FaYoutube, 
      href: 'https://youtube.com', 
      label: 'YouTube',
      color: '#FF0000'
    },
    { 
      icon: FaInstagram, 
      href: 'https://instagram.com', 
      label: 'Instagram',
      color: '#E4405F'
    },
    { 
      icon: FaTiktok, 
      href: 'https://tiktok.com', 
      label: 'TikTok',
      color: '#000000'
    },
    { 
      icon: FaWhatsapp, 
      href: 'https://wa.me/yournumber', 
      label: 'WhatsApp',
      color: '#25D366'
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 10, sm: 20 },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
      }}
    >
      {socialLinks.map((social) => (
        <Tooltip key={social.label} title={social.label} placement="left" arrow>
          <IconButton
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              backgroundColor: theme.palette.primary.main,
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transform: 'scale(1.1)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              },
            }}
            aria-label={social.label}
          >
            <social.icon size={20} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default SocialIcons;




