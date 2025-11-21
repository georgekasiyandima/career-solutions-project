import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Grid, Button, Typography, Box, IconButton, CircularProgress, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { API_BASE_URL } from '../../config/constants';

const FAQ = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/faqs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFaqs(data || []);
      } catch (err) {
        setError('Failed to load FAQs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = useMemo(() =>
    (faqs || []).filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ), [faqs, searchTerm]
  );

  const highlightText = useCallback((text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} style={{ color: '#43a047', fontWeight: 600 }}>{part}</span>
      ) : (
        part
      )
    );
  }, []);

  const handleAccordionChange = useCallback((panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleContactUs = useCallback(() => {
    navigate('/enquiry');
  }, [navigate]);

  return (
    <Box sx={{ py: 10, px: { xs: 2, sm: 4 }, bgcolor: 'linear-gradient(135deg, #004d40 0%, #2E7D32 100%)', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h3" align="center" fontWeight={700} color="white" gutterBottom fontFamily="'Poppins', sans-serif">
          Frequently Asked Questions
        </Typography>
        <Box sx={{ mb: 4, position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              style: { background: '#263238', color: '#fff', borderRadius: 8 },
              endAdornment: searchTerm && (
                <IconButton onClick={clearSearch} aria-label="Clear search" size="small">
                  <ClearIcon sx={{ color: '#43a047' }} />
                </IconButton>
              ),
            }}
            inputProps={{ 'aria-label': 'Search FAQs' }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress sx={{ color: '#43a047' }} />
          </Box>
        ) : error ? (
          <Box sx={{ mb: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <Grid item xs={12} md={6} lg={4} key={faq.id || index}>
                  <Accordion
                    expanded={expanded === index}
                    onChange={handleAccordionChange(index)}
                    sx={{
                      bgcolor: '#01332a',
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: '0 4px 24px 0 rgba(67,160,71,0.10)',
                      mb: 2,
                      borderLeft: '6px solid #43a047',
                      transition: 'box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 32px 0 rgba(67,160,71,0.18)',
                        background: 'linear-gradient(90deg, #014d40 0%, #2E7D32 100%)',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#43a047', fontSize: 32 }} />}
                      aria-controls={`faq-content-${faq.id || index}`}
                      id={`faq-header-${faq.id || index}`}
                      sx={{
                        '&:hover': {
                          background: 'rgba(67,160,71,0.08)',
                        },
                        minHeight: 72,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        fontFamily="'Poppins', sans-serif"
                        sx={{ fontSize: 20 }}
                      >
                        {highlightText(faq.question, searchTerm)}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: 'rgba(67,160,71,0.07)', borderRadius: 2, mt: -1 }}>
                      <Typography variant="body1" fontFamily="'Poppins', sans-serif" sx={{ color: '#e0f2f1', fontSize: 16 }}>
                        {highlightText(faq.answer, searchTerm)}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center" color="white" fontFamily="'Poppins', sans-serif">
                  No FAQs found matching your search.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="white" fontFamily="'Poppins', sans-serif" gutterBottom>
            "Big results require big ambitions."
          </Typography>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography color="white" fontFamily="'Poppins', sans-serif">
            Still have questions?{' '}
            <Button
              variant="text"
              sx={{ color: '#43a047', textTransform: 'none', fontWeight: 600 }}
              onClick={handleContactUs}
            >
              Contact us
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FAQ;