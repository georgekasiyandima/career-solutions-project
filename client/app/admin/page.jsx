'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import AdminDashboard from '../../src/components/pages/AdminDashboard';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function AdminPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Loading...
      </Box>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null;
  }

  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 8, md: 9 },
        }}
      >
        <AdminDashboard />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

