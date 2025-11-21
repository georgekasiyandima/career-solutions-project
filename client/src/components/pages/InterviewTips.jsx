import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Tabs,
  Tab,
  Chip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Button,

  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import QuizIcon from '@mui/icons-material/Quiz';
import DescriptionIcon from '@mui/icons-material/Description';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { API_BASE_URL } from '../../config/constants';

const TABS = [
  { label: 'All', value: 'all', icon: <TipsAndUpdatesIcon /> },
  { label: 'Tips', value: 'tip', icon: <TipsAndUpdatesIcon color="success" /> },
  { label: 'Questions', value: 'question', icon: <QuizIcon color="info" /> },
  { label: 'Cheatsheets', value: 'cheatsheet', icon: <DescriptionIcon color="secondary" /> },
];

const typeToColor = {
  tip: { color: 'success', label: 'Tip' },
  question: { color: 'info', label: 'Question' },
  cheatsheet: { color: 'secondary', label: 'Cheatsheet' },
};

const InterviewTips = () => {
  const [tab, setTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line
  }, [tab, search, category]);

  useEffect(() => {
          fetch(`${API_BASE_URL}/api/interview-resources`)
      .then(res => res.json())
      .then(data => {
        const cats = Array.from(new Set(data.map(r => r.category).filter(Boolean)));
        setCategories(cats);
      });
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const params = [];
      if (tab !== 'all') params.push(`type=${tab}`);
      if (search) params.push(`q=${encodeURIComponent(search)}`);
      if (category) params.push(`category=${encodeURIComponent(category)}`);
      const url = `${API_BASE_URL}/interview-resources${params.length ? '?' + params.join('&') : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="lg">
        <Box
          textAlign="center"
          mb={5}
          sx={{
            display: 'inline-block',
            px: { xs: 2, sm: 6 },
            py: { xs: 2, sm: 3 },
            borderRadius: 4,
            boxShadow: 3,
            background: theme => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'common.white',
            mx: 'auto',
            maxWidth: 700,
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: 'inherit', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
            Interview Tips & Cheatsheets
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Curated tips, common questions, and downloadable cheatsheets to help you ace your next interview.
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mb: 3 }}
        >
          {TABS.map(t => (
            <Tab
              key={t.value}
              value={t.value}
              icon={t.icon}
              iconPosition="start"
              label={t.label}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                mx: 0.5,
                textTransform: 'none',
                minHeight: 48,
              }}
              aria-label={t.label}
            />
          ))}
        </Tabs>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} alignItems="center">
          <TextField
            label="Search by keyword"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
            size="small"
            sx={{ maxWidth: 400 }}
          />
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={e => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Resource Cards */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress color="primary" size={48} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 6, fontSize: 18 }}>{error}</Alert>
        ) : resources.length === 0 ? (
          <Box textAlign="center" py={10}>
            <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" variant="h6">
              No resources found for your criteria.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {resources.map(resource => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card
                  sx={{
                    opacity: 0,
                    animation: 'fadeIn 0.6s ease-out forwards',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(20px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                    elevation={4}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: 8,
                      },
                      bgcolor: 'background.paper',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Chip
                          label={typeToColor[resource.type]?.label || resource.type}
                          color={typeToColor[resource.type]?.color || 'default'}
                          size="small"
                          sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                        />
                        {resource.category && (
                          <Typography variant="caption" color="text.secondary" ml={1}>
                            {resource.category}
                          </Typography>
                        )}
                      </Stack>
                      <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                        {resource.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: 60, whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {resource.content}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {resource.tags && resource.tags.split(',').map(tag => (
                          <Chip
                            key={tag}
                            label={tag.trim()}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: 12 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    {resource.type === 'cheatsheet' && resource.download_url && (
                      <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                        <Button
                          href={resource.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<DownloadIcon />}
                        >
                          Download Cheatsheet
                        </Button>
                      </CardActions>
                    )}
                  </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default InterviewTips; 