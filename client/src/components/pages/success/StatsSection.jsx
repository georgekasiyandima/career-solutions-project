import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import {
    Person,
    Work,
    FlightTakeoff,
    Send,
  } from "@mui/icons-material";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { styled, keyframes } from "@mui/material/styles";



const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.6); }
`;

const StatsCard = styled(Paper)(({ theme, index }) => ({
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: theme.spacing(3),
    padding: theme.spacing(4),
    textAlign: "center",
    transition: "all 0.5s ease-in-out",
    position: "relative",
    overflow: "hidden",
    animation: `${slideIn} 0.8s ease-out ${index * 0.1}s both`,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.15)",
      transform: "translateY(-15px) scale(1.05)",
      boxShadow: theme.shadows[20],
      animation: `${glow} 2s ease-in-out infinite`,
    },
  }));

const iconMap = {
    Person: <Person sx={{ fontSize: 50, color: "#4CAF50" }} />,
    Work: <Work sx={{ fontSize: 50, color: "#4CAF50" }} />,
    FlightTakeoff: <FlightTakeoff sx={{ fontSize: 50, color: "#4CAF50" }} />,
    Send: <Send sx={{ fontSize: 50, color: "#4CAF50" }} />,
  };
  

const StatsSection = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 8, background: "linear-gradient(135deg, #1A3C34 0%, #2E7D32 100%)" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Our Impact by the Numbers
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              opacity: 0.9,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Transforming careers through data-driven strategies and personalized support
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
                <StatsCard 
                  elevation={8} 
                  index={index}
                  sx={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <Box className="floating-icon" sx={{ mb: 3 }}>
                    {iconMap[stat.icon]}
                  </Box>
                  
                  <Typography
                    variant="h3"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    <VisibilitySensor partialVisibility>
                      {({ isVisible }) => (
                        <CountUp
                          start={0}
                          end={isVisible ? stat.value : 0}
                          duration={2.5}
                          separator=","
                          redraw={true}
                        />
                      )}
                    </VisibilitySensor>
                    {stat.suffix && (
                      <Box component="span" sx={{ color: "#4CAF50" }}>
                        {stat.suffix}
                      </Box>
                    )}
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: "semibold",
                      mb: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      opacity: 0.8,
                      mb: 2,
                    }}
                  >
                    {stat.description}
                  </Typography>
                  
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      bgcolor: "rgba(76, 175, 80, 0.2)",
                      color: "#4CAF50",
                      fontWeight: "bold",
                    }}
                  />
                </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection; 