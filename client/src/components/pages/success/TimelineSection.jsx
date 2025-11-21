import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import {
  Psychology,
  School,
  BusinessCenter,
  Celebration,
  RocketLaunch,
  CalendarToday,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const TimelineCard = styled(Paper)(({ theme, active }) => ({
  background: active ? "linear-gradient(135deg, #4CAF50, #2E7D32)" : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: `2px solid ${active ? "#4CAF50" : "rgba(76, 175, 80, 0.2)"}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  transition: "all 0.4s ease-in-out",
  position: "relative",
  cursor: "pointer",
  minHeight: 140,
  "&:hover": {
    transform: "translateX(8px) translateY(-2px)",
    boxShadow: theme.shadows[15],
    background: active ? "linear-gradient(135deg, #45a049, #2E7D32)" : "rgba(255, 255, 255, 1)",
    borderColor: active ? "#4CAF50" : "#4CAF50",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: -12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: active ? "#4CAF50" : "rgba(76, 175, 80, 0.8)",
    border: "4px solid white",
    boxShadow: active ? `0 0 20px rgba(76, 175, 80, 0.6)` : "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 3,
  },
}));

const iconMap = {
  Psychology: <Psychology />,
  School: <School />,
  BusinessCenter: <BusinessCenter />,
  Celebration: <Celebration />,
  RocketLaunch: <RocketLaunch />,
};

const TimelineSection = ({ timelineData }) => {
  const [activeTimeline, setActiveTimeline] = useState(0);

  if (!timelineData || timelineData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      py: 8, 
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"dots\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"rgba(76, 175, 80, 0.1)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23dots)\"/></svg>')",
        opacity: 0.5,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h3"
            sx={{
              color: "#1A3C34",
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Our Proven Process
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#495057",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: "medium",
            }}
          >
            A systematic approach that has helped hundreds achieve their career goals
          </Typography>
        </Box>
        
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: { xs: 30, md: 60 },
              top: 0,
              bottom: 0,
              width: 4,
              background: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 50%, #1A3C34 100%)",
              borderRadius: 2,
              zIndex: 1,
              boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
            }}
          />
          
          <Stack spacing={4}>
            {timelineData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: { xs: 6, md: 12 },
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <TimelineCard
                  active={activeTimeline === index}
                  onClick={() => setActiveTimeline(index)}
                  elevation={activeTimeline === index ? 12 : 4}
                  sx={{
                    width: "100%",
                    minHeight: 140,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 3,
                    width: "100%",
                    p: 2,
                  }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: activeTimeline === index ? "white" : "rgba(76, 175, 80, 0.15)",
                        color: activeTimeline === index ? "#4CAF50" : "#4CAF50",
                        minWidth: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: activeTimeline === index ? "0 8px 16px rgba(76, 175, 80, 0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {React.cloneElement(iconMap[item.icon], { 
                        sx: { fontSize: 28, fontWeight: "bold" } 
                      })}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: "bold", 
                          mb: 1,
                          color: activeTimeline === index ? "white" : "#1A3C34",
                          fontSize: { xs: "1.1rem", md: "1.3rem" },
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: activeTimeline === index ? "rgba(255,255,255,0.9)" : "#495057", 
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Chip
                        icon={<CalendarToday sx={{ fontSize: 16 }} />}
                        label={item.duration}
                        size="medium"
                        sx={{
                          bgcolor: activeTimeline === index ? "rgba(255,255,255,0.2)" : "rgba(76, 175, 80, 0.1)",
                          color: activeTimeline === index ? "white" : "#4CAF50",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          "& .MuiChip-icon": {
                            color: activeTimeline === index ? "white" : "#4CAF50",
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ 
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      color: activeTimeline === index ? "white" : "#4CAF50",
                      opacity: 0.7,
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                    </Box>
                  </Box>
                </TimelineCard>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default TimelineSection; 