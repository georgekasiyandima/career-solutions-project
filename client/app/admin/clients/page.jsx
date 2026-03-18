'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/context/AuthContext';
import Header from '../../../src/components/layout/Header';
import Footer from '../../../src/components/layout/Footer';
import AdminClients from '../../../src/components/pages/AdminClients';
import SocialIcons from '../../../src/components/common/SocialIcons';
import BackToTop from '../../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function AdminClientsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading || !isAuthenticated || (user && user.role !== 'admin')) {
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
        <AdminClients />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

