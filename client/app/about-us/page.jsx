'use client';

import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import AboutUs from '../../src/components/pages/AboutUs';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function AboutUsPage() {
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
        <AboutUs />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

