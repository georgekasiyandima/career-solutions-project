import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/features/HeroSection';
import EnquiryForm from './components/forms/EnquiryForm';
import DidYouKnow from './components/features/DidYouKnow';
import AboutUs from './components/pages/AboutUs';
import Footer from './components/layout/Footer';
import FAQ from './components/pages/FAQ';
import Jobs from './components/pages/Jobs';
import BookingForm from './components/forms/BookingForm';
import Feed from './components/features/Feed';
import JobDetails from './components/features/JobDetails';
import trackEvent from './services/trackEvent';
import ErrorBoundary from './components/common/ErrorBoundary';
import WhatsAppWidget from './components/features/WhatsAppWidget';
import SuccessStories from './components/pages/SuccessStories';
//import Testimonials from './components/pages/Testimonials';
import Hired from './components/pages/Hired';
import AdminFeed from './components/pages/AdminFeed';
import AdminJobSends from './components/pages/AdminJobSends';
import AdminClients from './components/pages/AdminClients';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminContent from './components/pages/AdminContent';
import AdminUsers from './components/pages/AdminUsers';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { trackPageView } from './services/analyticsService';
import AdminAnalytics from './components/pages/AdminAnalytics';
import InterviewTips from './components/pages/InterviewTips';
import AdminInterviewResources from './components/pages/AdminInterviewResources';
import ClientSuccessStories from './components/pages/ClientSuccessStories';
import EducationalHub from './components/pages/EducationalHub';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import theme from './config/theme';
import Profile from './components/pages/Profile';
import Payment from './components/pages/Payment';
const GuidedPurchase = lazy(() => import('./components/pages/GuidedPurchase'));

// Lazy-load heavy components
const Services = lazy(() => import('./components/pages/Services'));

const HomePage = () => (
  <>
    <HeroSection />
    <SuccessStories isHomePage={true} />
    <Feed />
    <DidYouKnow />
  </>
);

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
    trackPageView(location.pathname);
  }, [location]);

  const routes = (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/enquiry" element={<EnquiryForm />} />
      <Route path="/success-stories" element={<SuccessStories />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/hired" element={<Hired />} />
      <Route path="/interview-tips" element={<InterviewTips />} />
      <Route path="/guided-purchase" element={<GuidedPurchase />} />
      <Route path="/client-success-stories" element={<ClientSuccessStories />} />
      <Route path="/educational-hub" element={<EducationalHub />} />
      
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/feed" element={<ProtectedRoute><AdminFeed /></ProtectedRoute>} />
      <Route path="/admin/job-sends" element={<ProtectedRoute><AdminJobSends /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/interview-resources" element={<ProtectedRoute requiredRole="admin"><AdminInterviewResources /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#ffffff',
      }}
    >
      <ErrorBoundary>
        {!isLoginPage && <Header />}
        <Box 
          component="main" 
          sx={{ 
            flex: 1,
            pt: !isLoginPage ? { xs: 8, md: 9 } : 0,
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
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6">Loading...</Typography>
              </Box>
            }
          >
            {routes}
          </Suspense>
        </Box>
        {!isLoginPage && <Footer />}
        {!isLoginPage && <WhatsAppWidget />}
      </ErrorBoundary>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App; 