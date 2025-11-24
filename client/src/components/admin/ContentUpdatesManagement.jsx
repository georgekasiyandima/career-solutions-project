import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Card,
  CardContent,
  useTheme,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaLink,
  FaBuilding,
  FaCalendarAlt,
  FaEye,
} from 'react-icons/fa';
import { apiService } from '../../config/api';

const ContentUpdatesManagement = () => {
  const theme = useTheme();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    type: 'career_link',
    title: '',
    description: '',
    content: '',
    linkUrl: '',
    linkText: '',
    isExternal: true,
    companyName: '',
    companyLogoUrl: '',
    location: '',
    country: '',
    jobTitle: '',
    jobType: '',
    salaryRange: '',
    experienceLevel: '',
    requirements: '',
    applicationDeadline: '',
    driveStartDate: '',
    driveEndDate: '',
    driveLocation: '',
    imageUrl: '',
    videoUrl: '',
    priority: 0,
    isFeatured: false,
    isPinned: false,
    publishAt: '',
    expiresAt: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCareerUpdates();
      setUpdates(response.data || response);
    } catch (err) {
      setError('Failed to fetch content updates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (update = null) => {
    if (update) {
      setEditingUpdate(update);
      setFormData({
        type: update.type || 'career_link',
        title: update.title || '',
        description: update.description || '',
        content: update.content || '',
        linkUrl: update.link_url || '',
        linkText: update.link_text || '',
        isExternal: update.is_external !== false,
        companyName: update.company_name || '',
        companyLogoUrl: update.company_logo_url || '',
        location: update.location || '',
        country: update.country || '',
        jobTitle: update.job_title || '',
        jobType: update.job_type || '',
        salaryRange: update.salary_range || '',
        experienceLevel: update.experience_level || '',
        requirements: update.requirements || '',
        applicationDeadline: update.application_deadline ? update.application_deadline.split('T')[0] : '',
        driveStartDate: update.drive_start_date ? update.drive_start_date.split('T')[0] : '',
        driveEndDate: update.drive_end_date ? update.drive_end_date.split('T')[0] : '',
        driveLocation: update.drive_location || '',
        imageUrl: update.image_url || '',
        videoUrl: update.video_url || '',
        priority: update.priority || 0,
        isFeatured: update.is_featured || false,
        isPinned: update.is_pinned || false,
        publishAt: update.publish_at ? update.publish_at.split('T')[0] : '',
        expiresAt: update.expires_at ? update.expires_at.split('T')[0] : '',
      });
    } else {
      setEditingUpdate(null);
      setFormData({
        type: 'career_link',
        title: '',
        description: '',
        content: '',
        linkUrl: '',
        linkText: '',
        isExternal: true,
        companyName: '',
        companyLogoUrl: '',
        location: '',
        country: '',
        jobTitle: '',
        jobType: '',
        salaryRange: '',
        experienceLevel: '',
        requirements: '',
        applicationDeadline: '',
        driveStartDate: '',
        driveEndDate: '',
        driveLocation: '',
        imageUrl: '',
        videoUrl: '',
        priority: 0,
        isFeatured: false,
        isPinned: false,
        publishAt: '',
        expiresAt: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUpdate(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (editingUpdate) {
        await apiService.updateCareerUpdate(editingUpdate.id, formData);
        setSuccess('Content update updated successfully');
      } else {
        await apiService.createCareerUpdate(formData);
        setSuccess('Content update created successfully');
      }
      
      fetchUpdates();
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save content update');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content update?')) {
      try {
        await apiService.deleteCareerUpdate(id);
        setSuccess('Content update deleted successfully');
        fetchUpdates();
      } catch (err) {
        setError('Failed to delete content update');
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      career_link: 'primary',
      company_hiring: 'success',
      recruitment_drive: 'warning',
      internal_ad: 'info',
      job_opportunity: 'secondary',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700}>
            Content Updates Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.secondary.main },
            }}
          >
            Add Update
          </Button>
        </Stack>

        {/* Updates Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell>{update.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={update.type.replace('_', ' ')}
                      color={getTypeColor(update.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{update.company_name || 'N/A'}</TableCell>
                  <TableCell>{update.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={update.is_active ? 'Active' : 'Inactive'}
                      color={update.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {update.is_featured ? (
                      <Chip label="Yes" color="warning" size="small" />
                    ) : (
                      <Chip label="No" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{update.views || 0}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(update)}
                        color="primary"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(update.id)}
                        color="error"
                      >
                        <FaTrash />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUpdate ? 'Edit Content Update' : 'Add New Content Update'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="career_link">Career Link</MenuItem>
                  <MenuItem value="company_hiring">Company Hiring</MenuItem>
                  <MenuItem value="recruitment_drive">Recruitment Drive</MenuItem>
                  <MenuItem value="internal_ad">Internal Ad</MenuItem>
                  <MenuItem value="job_opportunity">Job Opportunity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link URL"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link Text"
                value={formData.linkText}
                onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Publish Date"
                type="date"
                value={formData.publishAt}
                onChange={(e) => setFormData({ ...formData, publishAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                }
                label="Featured"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  />
                }
                label="Pinned"
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingUpdate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContentUpdatesManagement;




