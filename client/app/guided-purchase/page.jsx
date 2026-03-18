'use client';

import { Suspense, lazy } from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';

const GuidedPurchase = lazy(() => import('../../src/components/pages/GuidedPurchase'));

export default function GuidedPurchasePage() {
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
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6">Loading...</Typography>
            </Box>
          }
        >
          <GuidedPurchase />
        </Suspense>
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

