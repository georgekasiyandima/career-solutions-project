'use client';

import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import FAQ from '../../src/components/pages/FAQ';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function FAQPage() {
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
        <FAQ />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

