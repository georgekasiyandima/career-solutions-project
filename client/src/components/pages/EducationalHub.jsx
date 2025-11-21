import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaYoutube, 
  FaVimeo, 
  FaLink, 
  FaSearch, 
  FaBook, 
  FaVideo, 
  FaFileAlt, 
  FaGlobe, 
  FaStar,
  FaClock,
  FaUser,
  FaEye,
  FaUpload,
  FaExternalLinkAlt,
  FaTimes,
  FaEdit,
  FaTrash,
  FaShip,
  FaDownload
} from 'react-icons/fa';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  ToggleButton, 
  ToggleButtonGroup, 
  Chip, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Tooltip, 
  Snackbar, 
  Alert, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../../config/constants';

const EducationalHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // For admin features
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [educationalResources, setEducationalResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Resources', icon: FaBook, count: 0 },
    { id: 'videos', name: 'Video Tutorials', icon: FaVideo, count: 0 },
    { id: 'documents', name: 'Documents & Guides', icon: FaFileAlt, count: 0 },
    { id: 'links', name: 'External Links', icon: FaGlobe, count: 0 },
    { id: 'interviews', name: 'Interview Prep', icon: FaStar, count: 0 },
    { id: 'resume', name: 'Resume Writing', icon: FaFileAlt, count: 0 },
    { id: 'visa', name: 'Visa Applications', icon: FaGlobe, count: 0 },
    { id: 'cruise', name: 'Cruise Ship Jobs', icon: FaShip, count: 0 }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/interview-resources`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'You are not authorized to view these resources.' : 'Failed to fetch resources');
        return res.json();
      })
      .then((data) => {
        // Map backend fields to frontend structure
        const mapped = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.content || '',
          category: item.category || 'all',
          type: item.type || 'document',
          source: item.source || 'internal',
          url: item.download_url || '',
          thumbnail: item.thumbnail || '',
          duration: item.duration || '',
          author: item.author || 'Career Solutions',
          views: item.views || 0,
          rating: item.rating || 5.0,
          tags: item.tags ? (Array.isArray(item.tags) ? item.tags : String(item.tags).split(',')) : [],
          difficulty: item.difficulty || 'All Levels',
          language: item.language || 'English',
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '',
          isFeatured: !!item.is_featured
        }));
        setEducationalResources(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'An error occurred');
        setLoading(false);
      });
  }, []);

  const filteredResources = educationalResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleResourceSelect = (resource) => {
    setSelectedResource(resource);
  };

  const closeModal = () => {
    setSelectedResource(null);
  };

  const handleUpload = (newResource) => {
    setEducationalResources(prev => [newResource, ...prev]);
    setShowUploadModal(false);
    setSnackbar({ open: true, message: 'Resource uploaded successfully!', severity: 'success' });
  };

  const handleEdit = (updatedResource) => {
    setEducationalResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
    setShowEditModal(false);
    setSnackbar({ open: true, message: 'Resource updated successfully!', severity: 'success' });
  };

  const handleDelete = (resourceId) => {
    setEducationalResources(prev => prev.filter(r => r.id !== resourceId));
    setSnackbar({ open: true, message: 'Resource deleted successfully!', severity: 'success' });
  };

  const handleDeleteWithFeedback = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      handleDelete(resourceId);
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'youtube': return <FaYoutube />;
      case 'vimeo': return <FaVimeo />;
      case 'external': return <FaExternalLinkAlt />;
      default: return <FaLink />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <FaVideo />;
      case 'document': return <FaFileAlt />;
      case 'link': return <FaGlobe />;
      default: return <FaBook />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        py: 6, 
        background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={40} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        py: 6, 
        background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
      }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 6, 
      background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)" 
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Educational Hub
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1rem',
            }}
          >
            Access comprehensive learning resources to advance your career and professional development
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={<FaUpload />}
                onClick={() => setShowUploadModal(true)}
                sx={{
                  background: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  py: 1,
                  px: 2,
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  },
                }}
              >
                Upload Resource
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary,
              fontSize: '1rem',
            }}
          >
            Categories
          </Typography>
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap" 
            useFlexGap
            sx={{ gap: 1 }}
          >
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: selectedCategory === category.id ? theme.palette.primary.main : 'transparent',
                  color: selectedCategory === category.id ? 'white' : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  '&:hover': {
                    bgcolor: selectedCategory === category.id ? theme.palette.primary.dark : 'rgba(26, 95, 122, 0.08)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Resources Grid */}
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  },
                }}
                onClick={() => handleResourceSelect(resource)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {getTypeIcon(resource.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary,
                          fontSize: '1rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {resource.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.8rem',
                          lineHeight: 1.4,
                          mb: 2,
                        }}
                      >
                        {resource.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          fontSize: '0.7rem',
                          bgcolor: theme.palette.secondary.main 
                        }}
                      >
                        {resource.author.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.7rem',
                        }}
                      >
                        {resource.author}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaEye size={10} style={{ color: theme.palette.text.secondary }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.7rem',
                        }}
                      >
                        {resource.views}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={resource.category}
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.secondary.main}20`,
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                    {isAdmin && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(resource);
                            setShowEditModal(true);
                          }}
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWithFeedback(resource.id);
                          }}
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              color: theme.palette.error.main,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredResources.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1rem',
              }}
            >
              No resources found for the selected criteria.
            </Typography>
          </Box>
        )}

        {/* Resource Detail Modal */}
        <Dialog
          open={!!selectedResource}
          onClose={closeModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {selectedResource && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {selectedResource.title}
                  </Typography>
                  <IconButton onClick={closeModal}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ pt: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 3,
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                  }}
                >
                  {selectedResource.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip
                    label={selectedResource.category}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.secondary.main}20`,
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    label={selectedResource.difficulty}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.primary.main}20`,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaPlay />}
                    href={selectedResource.url}
                    target="_blank"
                    sx={{
                      background: theme.palette.primary.main,
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: theme.palette.primary.dark,
                      },
                    }}
                  >
                    View Resource
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FaDownload />}
                    href={selectedResource.url}
                    target="_blank"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        background: 'rgba(26, 95, 122, 0.08)',
                      },
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadResourceForm
            onUpload={handleUpload}
            onClose={() => setShowUploadModal(false)}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedResource && (
          <EditResourceForm
            resource={selectedResource}
            onEdit={handleEdit}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

// Upload Resource Form Component
const UploadResourceForm = ({ onUpload, onClose }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'all',
    type: 'document',
    url: '',
    tags: '',
    difficulty: 'All Levels',
    language: 'English'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResource = {
      id: Date.now(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      author: 'Career Solutions',
      views: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
      isFeatured: false
    };
    onUpload(newResource);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Upload New Resource
                  </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.8rem',
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: theme.palette.primary.main,
            fontSize: '0.8rem',
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Resource Form Component
const EditResourceForm = ({ resource, onEdit, onClose }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: resource.title,
    description: resource.description,
    category: resource.category,
    type: resource.type,
    url: resource.url,
    tags: resource.tags.join(', '),
    difficulty: resource.difficulty,
    language: resource.language
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedResource = {
      ...resource,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };
    onEdit(updatedResource);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.125rem',
            }}
          >
            Edit Resource
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem',
                },
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: theme.palette.primary.main,
            fontSize: '0.875rem',
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EducationalHub; 