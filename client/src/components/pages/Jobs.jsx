import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Work as WorkIcon, LocationOn as LocationIcon, AccessTime as AccessTimeIcon, Business as BusinessIcon } from '@mui/icons-material';
import { JOB_TYPES, JOB_CATEGORIES } from '../../config/constants';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError('An error occurred while fetching jobs. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [API_URL]);

  useEffect(() => {
    let results = jobs;
    if (searchTerm) {
      results = results.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (jobTypeFilter) {
      results = results.filter((job) => job.job_type === jobTypeFilter);
    }
    if (categoryFilter) {
      results = results.filter((job) => job.category === categoryFilter);
    }
    setFilteredJobs(results);
  }, [searchTerm, jobTypeFilter, categoryFilter, jobs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobTypeFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setJobTypeFilter('');
    setCategoryFilter('');
  };

  // Color helpers for chips
  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case 'Full-time':
        return 'success';
      case 'Part-time':
        return 'info';
      case 'Contract':
        return 'secondary';
      case 'Internship':
        return 'primary';
      case 'Freelance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'IT':
        return 'primary';
      case 'Marketing':
        return 'secondary';
      case 'Data Science':
        return 'warning';
      case 'Cruise Jobs':
        return 'info';
      case 'Land Jobs':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      py: 8 
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b', 
              mb: 2 
            }}
          >
            Job Opportunities
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#64748b', 
              maxWidth: 600, 
              mx: 'auto' 
            }}
          >
            Explore the latest job openings tailored to your career goals with Career Solutions
          </Typography>
        </Box>

        {/* Search and Filters Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 4, 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
          }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs by title, company, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2 
                } 
              }}
              inputProps={{ 'aria-label': 'Search jobs' }}
            />
            
            {/* Filter Toggle and Clear */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Button
                startIcon={<FilterListIcon />}
                variant="outlined"
                onClick={() => setShowFilters((prev) => !prev)}
                sx={{ 
                  borderRadius: 2, 
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': {
                    borderColor: '#1d4ed8',
                    backgroundColor: '#eff6ff'
                  }
                }}
              >
                Filters
              </Button>
              {(searchTerm || jobTypeFilter || categoryFilter) && (
                <Button 
                  size="small" 
                  onClick={clearFilters} 
                  sx={{ 
                    textDecoration: 'underline', 
                    color: '#64748b',
                    '&:hover': {
                      color: '#2563eb'
                    }
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </Stack>
            
            {/* Filters */}
            <Box 
              sx={{
                maxHeight: showFilters ? '500px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={jobTypeFilter}
                      onChange={handleJobTypeChange}
                      label="Job Type"
                      sx={{ 
                        borderRadius: 2 
                      }}
                    >
                      <MenuItem value="">All Job Types</MenuItem>
                      {JOB_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={handleCategoryChange}
                      label="Category"
                      sx={{ 
                        borderRadius: 2 
                      }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {JOB_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            {/* Active Filters Display */}
            {(searchTerm || jobTypeFilter || categoryFilter) && (
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
                {searchTerm && (
                  <Chip 
                    label={`Search: "${searchTerm}"`} 
                    color="primary" 
                    size="small"
                    sx={{ 
                      backgroundColor: '#eff6ff',
                      color: '#1e40af'
                    }} 
                  />
                )}
                {jobTypeFilter && (
                  <Chip 
                    label={`Type: ${jobTypeFilter}`} 
                    color={getJobTypeColor(jobTypeFilter)} 
                    size="small"
                  />
                )}
                {categoryFilter && (
                  <Chip 
                    label={`Category: ${categoryFilter}`} 
                    color={getCategoryColor(categoryFilter)} 
                    size="small"
                  />
                )}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography sx={{ mt: 3, color: '#64748b' }}>
              Loading jobs...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* No Results */}
        {!loading && !error && filteredJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              p: 6, 
              maxWidth: 400, 
              mx: 'auto', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
            }}>
              <WorkIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                No jobs found
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          </Box>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  } 
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mb: 3 
                    }}>
                      <Box sx={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: 2, 
                        backgroundColor: '#2563eb', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <WorkIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      mb: 2 
                    }}>
                      {job.title}
                    </Typography>
                    
                    <Stack spacing={1} mb={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {job.company}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {job.job_type}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                      <Chip 
                        label={job.job_type} 
                        color={getJobTypeColor(job.job_type)} 
                        size="small" 
                      />
                      <Chip 
                        label={job.category} 
                        color={getCategoryColor(job.category)} 
                        size="small" 
                      />
                    </Stack>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                      }}
                    >
                      {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ pt: 0, pb: 2, px: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button
                      component={Link}
                      to={`/jobs/${job.id}`}
                      variant="contained"
                      fullWidth
                      sx={{ 
                        borderRadius: 2, 
                        fontWeight: 600,
                        backgroundColor: '#2563eb',
                        '&:hover': {
                          backgroundColor: '#1d4ed8'
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      component={Link}
                      to="/enquiry"
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        borderRadius: 2, 
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        '&:hover': { 
                          borderColor: '#1d4ed8',
                          backgroundColor: '#eff6ff'
                        } 
                      }}
                    >
                      Enquire
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Results Count */}
        {!loading && !error && filteredJobs.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography sx={{ color: '#64748b' }}>
              Showing {filteredJobs.length} of {jobs.length} jobs
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Jobs;