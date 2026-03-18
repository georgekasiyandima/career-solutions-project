'use client';

import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import ClientSuccessStories from '../../src/components/pages/ClientSuccessStories';
import SocialIcons from '../../src/components/common/SocialIcons';
import BackToTop from '../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function ClientSuccessStoriesPage() {
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
        <ClientSuccessStories />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

