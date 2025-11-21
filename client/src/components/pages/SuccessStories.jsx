import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  // useTheme,
  // useMediaQuery,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from "@mui/material";
import {
  Person,
  Work,
  FlightTakeoff,
  Send,
  Star,
  TrendingUp,
  EmojiEvents,
  CheckCircle,
  Timeline,
  Celebration,
  RocketLaunch,
  Psychology,
  School,
  BusinessCenter,
  LocationOn,
  CalendarToday,
  ArrowForward,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  getSuccessStories,
  getStats,
  getTimelineData,
} from "../../services/successStoriesService";
import StatsSection from "./success/StatsSection";
import TimelineSection from "./success/TimelineSection";
import SuccessStoriesList from "./success/SuccessStoriesList";

// Temporary fix - comment out problematic sections
const TEMPORARY_DISABLE = true;

// Simplified styling for minimalist approach
const HeroSection = styled(Box)(() => ({
  position: "relative",
  minHeight: "40vh",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f8fafc",
  overflow: "hidden",
}));

const AnimatedCard = styled(Card)(() => ({
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const StatsCard = styled(Paper)(() => ({
  padding: 24,
  borderRadius: 8,
  backgroundColor: "white",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const SuccessStories = ({ isHomePage = false }) => {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({});
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [storiesData, statsData, timelineData] = await Promise.all([
        getSuccessStories({ page: currentPage, limit: 6 }),
        getStats(),
        getTimelineData(),
      ]);

      setStories(storiesData.stories || []);
      setStats(statsData || {});
      setTimelineData(timelineData || []);
      setTotalPages(storiesData.totalPages || 1);
    } catch (err) {
      console.error("Error fetching success stories:", err);
      setError("Failed to load success stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderHeroSection = () => (
    <HeroSection>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Success Stories
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  mb: 3,
                  lineHeight: 1.5,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              >
                Real stories from real people who transformed their careers with our guidance.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  icon={<EmojiEvents />}
                  label="Career Growth"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label="Salary Increase"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  icon={<FlightTakeoff />}
                  label="Overseas Jobs"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // animation: `${float} 3s ease-in-out infinite`,
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Celebration sx={{ fontSize: 80, color: "white" }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );

  const renderStatsSection = () => (
    <Box sx={{ py: 6, background: "rgba(248, 250, 252, 0.8)" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 1,
                            color: "#1e293b",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Impact by Numbers
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 6,
            color: "#64748b",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Our success is measured by the achievements of our clients
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              icon: <Person />,
              label: "Clients Placed",
              value: stats.clientsPlaced || 0,
              color: "#2563eb",
            },
            {
              icon: <Work />,
              label: "Jobs Secured",
              value: stats.jobsSecured || 0,
              color: "#64748b",
            },
            {
              icon: <FlightTakeoff />,
              label: "Overseas Placements",
              value: stats.overseasPlacements || 0,
              color: "#0ea5e9",
            },
            {
              icon: <TrendingUp />,
              label: "Success Rate",
              value: stats.successRate || 0,
              suffix: "%",
              color: "#10b981",
            },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatsCard>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <VisibilitySensor>
                    {({ isVisible }) => (
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          mb: 1,
                        }}
                      >
                        {isVisible ? (
                          <CountUp
                            end={stat.value}
                            duration={2}
                            suffix={stat.suffix || ""}
                          />
                        ) : (
                          "0"
                        )}
                      </Typography>
                    )}
                  </VisibilitySensor>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchPageData}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" }}>
      {!isHomePage && renderHeroSection()}
      
      {!isHomePage && renderStatsSection()}

      <Container maxWidth="lg" sx={{ py: isHomePage ? 4 : 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1e293b",
              textAlign: isHomePage ? "center" : "left",
            }}
          >
            {isHomePage ? "Featured Success Stories" : "All Success Stories"}
          </Typography>
          {!isHomePage && (
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                maxWidth: 600,
                textAlign: "center",
                mx: "auto",
              }}
            >
              Discover how our clients achieved their career goals and transformed their lives
            </Typography>
          )}
        </Box>

        <SuccessStoriesList stories={stories} />

        {!isHomePage && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {isHomePage && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              component={Link}
              to="/success-stories"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: "#2563eb",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              View All Stories
            </Button>
          </Box>
        )}
      </Container>

      {!isHomePage && <TimelineSection timelineData={timelineData} />}
    </Box>
  );
};

export default SuccessStories;
