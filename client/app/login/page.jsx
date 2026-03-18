'use client';

import Login from '../../src/components/auth/Login';
import { Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#ffffff',
      }}
    >
      <Login />
    </Box>
  );
}

