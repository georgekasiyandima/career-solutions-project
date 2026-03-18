'use client';

import { useParams } from 'next/navigation';
import Header from '../../../src/components/layout/Header';
import Footer from '../../../src/components/layout/Footer';
import JobDetails from '../../../src/components/features/JobDetails';
import SocialIcons from '../../../src/components/common/SocialIcons';
import BackToTop from '../../../src/components/common/BackToTop';
import { Box } from '@mui/material';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id;

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
        <JobDetails jobId={jobId} />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

