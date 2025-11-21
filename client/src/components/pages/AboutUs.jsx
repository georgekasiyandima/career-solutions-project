import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { FaLinkedin, FaTwitter, FaBullseye, FaHeart, FaUsers, FaRocket, FaStar, FaShieldAlt, FaHandshake, FaGlobe } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      
      {/* Hero Section */}
      <Box sx={{ pt: 12, pb: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <Chip 
                label="#ChangingLives" 
                sx={{ 
                  backgroundColor: '#0B444A',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 3,
                  py: 1,
                  fontFamily: '"Josefin Sans", sans-serif',
                }}
              />
            </Box>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                color: '#0B444A', 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              SERVICE BEYOND
              <Box component="span" sx={{ display: 'block', color: '#13484C' }}>
                MEASURE
              </Box>
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#64748b', 
                maxWidth: 800, 
                mx: 'auto',
                lineHeight: 1.6,
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              We don't just place people in jobs. We transform lives, build futures, and create opportunities that ripple through families and communities.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#0B444A', 
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              Our Mission
            </Typography>
            <Divider sx={{ width: 96, mx: 'auto', borderColor: '#0B444A', borderWidth: 2 }} />
          </Box>

          <Card sx={{ 
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <FaHeart style={{ fontSize: 48, color: '#0B444A', marginBottom: 16 }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0B444A', 
                    mb: 3,
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                >
                  Service, Service, Service
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#64748b', 
                    lineHeight: 1.6,
                    maxWidth: 800,
                    mx: 'auto',
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                >
                  Our mantra is simple yet profound: <Box component="span" sx={{ color: '#0B444A', fontWeight: 600 }}>
                    "Service to a brother without number"
                  </Box>. 
                  This isn't just a business for us—it's a calling that stems from our intrinsic perfectionist drive and natural enthusiasm to assist without measure.
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: 2, 
                    p: 4 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B444A', mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Our Drive
                    </Typography>
                    <Typography sx={{ color: '#64748b', lineHeight: 1.6, fontFamily: '"Josefin Sans", sans-serif' }}>
                      We understand the difficult roads traveled by our fellow people. As migrants in Cape Town, we've walked the same path of struggle and opportunity. 
                      Every interview we secure is celebrated because it represents our hard work and your potential.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: 2, 
                    p: 4 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B444A', mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Our Impact
                    </Typography>
                    <Typography sx={{ color: '#64748b', lineHeight: 1.6, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Most of our clients come from very poor backgrounds. For many, getting a job on cruise ships is their first plane trip. 
                      Our work goes beyond job placement—we're building better futures for entire families.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Story Section */}
      <Box sx={{ py: 8, px: 2, background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#0B444A', 
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              Our Story of Service
            </Typography>
            <Divider sx={{ width: 96, mx: 'auto', borderColor: '#0B444A', borderWidth: 2 }} />
          </Box>

          <Card sx={{ 
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(11, 68, 74, 0.1)',
            mb: 6,
            border: '1px solid rgba(11, 68, 74, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <FaGlobe style={{ fontSize: 48, color: '#0B444A', marginBottom: 16 }} />
              </Box>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#0B444A', 
                  lineHeight: 1.8,
                  mb: 4,
                  textAlign: 'center',
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Since 2022, Career Solutions has been dedicated to transforming lives by helping individuals secure lucrative positions on cruise ships, international truck driving opportunities, and various roles abroad. Our mission is simple: connect talented people with life-changing career opportunities that provide not just jobs, but pathways to financial freedom and global experiences.
              </Typography>
              
              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(11, 68, 74, 0.05)', 
                    borderRadius: 2, 
                    p: 3,
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <FaRocket style={{ fontSize: 32, color: '#0B444A', marginBottom: 12 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B444A', mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Cruise Ship Careers
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Helping professionals land positions on luxury cruise lines with competitive salaries and travel opportunities.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(11, 68, 74, 0.05)', 
                    borderRadius: 2, 
                    p: 3,
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <FaGlobe style={{ fontSize: 32, color: '#0B444A', marginBottom: 12 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B444A', mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                      International Truck Driving
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Connecting skilled drivers with international logistics companies offering excellent compensation packages.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(11, 68, 74, 0.05)', 
                    borderRadius: 2, 
                    p: 3,
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <FaUsers style={{ fontSize: 32, color: '#0B444A', marginBottom: 12 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B444A', mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                      Global Opportunities
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Opening doors to diverse career paths abroad, from hospitality to logistics and beyond.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Founders Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* George */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      src="/images/George.jpg"
                      alt="George Kasiyandima"
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        border: '4px solid #0B444A'
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      width: 48,
                      height: 48,
                      backgroundColor: '#0B444A',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaRocket style={{ fontSize: 20, color: 'white' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0B444A', 
                      mb: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    George Kasiyandima
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#0B444A', 
                      fontWeight: 500,
                      mb: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    Co-Founder & Technical Lead
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#64748b', 
                      mb: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    Full Stack Software Engineer
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#13484C', 
                      mb: 3,
                      fontFamily: '"Josefin Sans", sans-serif',
                      fontWeight: 500,
                      fontStyle: 'italic'
                    }}
                  >
                    Wine Enthusiast
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#64748b', 
                      fontSize: '0.875rem',
                      mb: 4,
                      fontStyle: 'italic',
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    "Our perfectionist drive and natural enthusiasm to assist without measure drives everything we do."
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      href="https://linkedin.com/in/george-kasiyandima"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        width: 40,
                        height: 40,
                        backgroundColor: 'rgba(11, 68, 74, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(11, 68, 74, 0.2)' }
                      }}
                    >
                      <FaLinkedin style={{ fontSize: 16, color: '#0B444A' }} />
                    </Button>
                    <Button
                      href="https://twitter.com/george-kasiyandima"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        width: 40,
                        height: 40,
                        backgroundColor: 'rgba(11, 68, 74, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(11, 68, 74, 0.2)' }
                      }}
                    >
                      <FaTwitter style={{ fontSize: 16, color: '#0B444A' }} />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Getrude */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      src="/images/Getty.jpg"
                      alt="Getrude Bunga"
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        border: '4px solid #0B444A'
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      width: 48,
                      height: 48,
                      backgroundColor: '#0B444A',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaHeart style={{ fontSize: 20, color: 'white' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0B444A', 
                      mb: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    Getrude Bunga
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#0B444A', 
                      fontWeight: 500,
                      mb: 1,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    Co-Founder & Client Relations
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#64748b', 
                      mb: 3,
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    Entrepreneur & People Champion
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#64748b', 
                      fontSize: '0.875rem',
                      mb: 4,
                      fontStyle: 'italic',
                      fontFamily: '"Josefin Sans", sans-serif',
                    }}
                  >
                    "Straightforwardness and super honest talk with clients—that's what builds trust and changes lives."
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      href="https://linkedin.com/in/getrude-bunga"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        width: 40,
                        height: 40,
                        backgroundColor: 'rgba(11, 68, 74, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(11, 68, 74, 0.2)' }
                      }}
                    >
                      <FaLinkedin style={{ fontSize: 16, color: '#0B444A' }} />
                    </Button>
                    <Button
                      href="https://twitter.com/getrude-bunga"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        width: 40,
                        height: 40,
                        backgroundColor: 'rgba(11, 68, 74, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(11, 68, 74, 0.2)' }
                      }}
                    >
                      <FaTwitter style={{ fontSize: 16, color: '#0B444A' }} />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              sx={{ 
                color: '#0B444A', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 2,
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              OUR CORE VALUES
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#0B444A', 
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: '"Josefin Sans", sans-serif',
              }}
            >
              What Drives Us Forward
            </Typography>
            <Divider sx={{ width: 96, mx: 'auto', borderColor: '#0B444A', borderWidth: 2 }} />
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: FaHandshake,
                title: "Transparency",
                description: "Clear pricing, honest discussions about potential, and informed decisions at every stage.",
                color: "#3b82f6"
              },
              {
                icon: FaStar,
                title: "Excellence",
                description: "Perfectionist drive to deliver the highest quality service and support to every client.",
                color: "#f59e0b"
              },
              {
                icon: FaHeart,
                title: "Service",
                description: "Natural enthusiasm to assist without measure—service to a brother without number.",
                color: "#ef4444"
              },
              {
                icon: FaGlobe,
                title: "Impact",
                description: "Changing lives, building futures, and creating opportunities that ripple through communities.",
                color: "#10b981"
              }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: value.color,
                      borderRadius: 2,
                      mx: 'auto',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <value.icon style={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#0B444A', 
                        mb: 3,
                        fontFamily: '"Josefin Sans", sans-serif',
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', lineHeight: 1.6, fontFamily: '"Josefin Sans", sans-serif' }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Metrics Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Card sx={{ 
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#0B444A', 
                    mb: 3,
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                >
                  Our Impact in Numbers
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#64748b',
                    maxWidth: 600,
                    mx: 'auto',
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                >
                  Every number represents a life changed, a family supported, and a future built.
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                {[
                  { number: "80%+", label: "Interview Success Rate", icon: FaBullseye },
                  { number: "95%", label: "Visa Application Success", icon: FaShieldAlt },
                  { number: "1000+", label: "Lives Changed", icon: FaUsers },
                  { number: "70%", label: "Job Placement Success", icon: FaRocket }
                ].map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        backgroundColor: '#0B444A',
                        borderRadius: 2,
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <metric.icon style={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#0B444A', 
                          mb: 1,
                          fontSize: { xs: '2rem', md: '3rem' },
                          fontFamily: '"Josefin Sans", sans-serif',
                        }}
                      >
                        {metric.number}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontFamily: '"Josefin Sans", sans-serif' }}>
                        {metric.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="md">
          <Card sx={{ 
            background: 'linear-gradient(135deg, #0B444A 0%, #13484C 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(11, 68, 74, 0.3)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label="#ChangingLives" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 3,
                    py: 1,
                    fontFamily: '"Josefin Sans", sans-serif',
                  }}
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'white', 
                  mb: 4,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontFamily: '"Josefin Sans", sans-serif',
                }}
              >
                Ready to Transform Your Future?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.95)', 
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  fontFamily: '"Josefin Sans", sans-serif',
                }}
              >
                We're doing this for monetary value, yes, but we're also sending a silent message to our clients: try the same, and definitely we will change lives. 
                Every interview is celebrated because it will be testament to our hard work and your potential.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  href="/services"
                  variant="contained"
                  sx={{ 
                    backgroundColor: 'white',
                    color: '#0B444A',
                    px: 4,
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                >
                  <FaUsers style={{ marginRight: 8 }} />
                  Explore Our Services
                </Button>
                <Button
                  href="/jobs"
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderWidth: 2,
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontWeight: 600,
                    '&:hover': { 
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <FaRocket style={{ marginRight: 8 }} />
                  View Opportunities
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;