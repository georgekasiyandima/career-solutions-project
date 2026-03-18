'use client';

import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import Jobs from '../../src/components/pages/Jobs';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function JobsPage() {
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
        <Jobs />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

