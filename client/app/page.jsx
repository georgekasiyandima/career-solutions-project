'use client';

import { Suspense } from 'react';
import { Box } from '@mui/material';
import HeroSection from '../src/components/features/HeroSection';
import AnimatedStats from '../src/components/features/AnimatedStats';
import FeaturedServices from '../src/components/features/FeaturedServices';
import JobCategories from '../src/components/features/JobCategories';
import SuccessStories from '../src/components/pages/SuccessStories';
import TestimonialsCarousel from '../src/components/features/TestimonialsCarousel';
import TrustIndicators from '../src/components/features/TrustIndicators';
import Feed from '../src/components/features/Feed';
import DidYouKnow from '../src/components/features/DidYouKnow';
import NewsletterSignup from '../src/components/features/NewsletterSignup';
import SocialProof from '../src/components/features/SocialProof';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import SocialIcons from '../src/components/common/SocialIcons';
import BackToTop from '../src/components/common/BackToTop';

export default function HomePage() {
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
        {/* Hero Section with enhanced animations */}
        <HeroSection />
        
        {/* Social Proof Bar */}
        <SocialProof />
        
        {/* Animated Stats Section */}
        <AnimatedStats />
        
        {/* Featured Services Preview */}
        <FeaturedServices />
        
        {/* Job Categories */}
        <JobCategories />
        
        {/* Success Stories */}
        <SuccessStories isHomePage={true} />
        
        {/* Testimonials Carousel */}
        <TestimonialsCarousel />
        
        {/* Trust Indicators */}
        <TrustIndicators />
        
        {/* Feed Section */}
        <Feed />
        
        {/* Did You Know Facts */}
        <DidYouKnow />
        
        {/* Newsletter Signup */}
        <NewsletterSignup />
      </Box>
      <Footer />
      <SocialIcons />
      <BackToTop />
    </>
  );
}

