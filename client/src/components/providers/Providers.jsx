'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../../config/theme';
import { AuthProvider } from '../../context/AuthContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

