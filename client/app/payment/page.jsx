'use client';

import { Suspense } from 'react';
import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import Payment from '../../src/components/pages/Payment';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function PaymentPage() {
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
        <Suspense
          fallback={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>Loading payment...</Typography>
            </Box>
          }
        >
          <Payment />
        </Suspense>
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

