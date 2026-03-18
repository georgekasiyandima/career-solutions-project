'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { TrendingUp, People, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const SocialProof = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const recentPlacements = [
    { name: 'Sarah M.', role: 'Cruise Director', company: 'Royal Caribbean', time: '2 hours ago' },
    { name: 'John D.', role: 'Marine Engineer', company: 'Norwegian', time: '5 hours ago' },
    { name: 'Maria L.', role: 'Chef', company: 'Disney Cruise', time: '1 day ago' },
  ];

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: '#f8fafc',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Live Stats */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People sx={{ color: '#667eea', fontSize: 24 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0B444A',
                      fontFamily: '"Josefin Sans", sans-serif',
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    12
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.75rem',
                    }}
                  >
                    Active Now
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ color: '#059669', fontSize: 24 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0B444A',
                      fontFamily: '"Josefin Sans", sans-serif',
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    8 Today
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.75rem',
                    }}
                  >
                    New Placements
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ color: '#ea580c', fontSize: 24 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0B444A',
                      fontFamily: '"Josefin Sans", sans-serif',
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    24h
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.75rem',
                    }}
                  >
                    Avg Response
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Recent Placements */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                Recent placements:
              </Typography>
              <Stack direction="row" spacing={-1}>
                {recentPlacements.map((placement, index) => (
                  <Avatar
                    key={index}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {placement.name.charAt(0)}
                  </Avatar>
                ))}
              </Stack>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SocialProof;

