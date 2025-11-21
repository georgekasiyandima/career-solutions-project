import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Skeleton } from '@mui/material';

// Simulated API call with delay
const fetchFactDetails = async (factId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Simulated API response
  const details = {
    1: {
      source: "Royal Caribbean International",
      date: "2024",
      category: "Modern Cruise Ships",
      relatedFacts: ["Largest passenger capacity", "Water park at sea", "AquaTheater"],
      stats: {
        length: "1,198 feet",
        grossTonnage: "250,800",
        passengerCapacity: "7,600"
      }
    },
    2: {
      source: "Cunard Line Archives",
      date: "1840",
      category: "Historical Cruise Ships",
      relatedFacts: ["First transatlantic service", "Live livestock", "Victorian era travel"],
      stats: {
        length: "207 feet",
        grossTonnage: "1,154",
        passengerCapacity: "115"
      }
    },
    3: {
      source: "Carnival Cruise Line",
      date: "2024",
      category: "Culinary Excellence",
      relatedFacts: ["Valentine's Day special", "Chocolate production", "Fleet-wide operations"],
      stats: {
        strawberriesPerShip: "2,000",
        totalFleet: "25 ships",
        productionTime: "24 hours"
      }
    },
    4: {
      source: "Norwegian Cruise Line",
      date: "1999",
      category: "Technology Innovation",
      relatedFacts: ["Internet at sea", "Digital revolution", "Modern connectivity"],
      stats: {
        shipName: "Norwegian Sky",
        internetSpeed: "56kbps",
        cafeLocation: "Galleria Promenade"
      }
    },
    5: {
      source: "Disney Cruise Line",
      date: "1998",
      category: "Engineering Marvels",
      relatedFacts: ["Anchor weight", "Chain length", "Marine engineering"],
      stats: {
        anchorWeight: "28,200 pounds",
        chainLength: "1,000 feet",
        linkWeight: "130 pounds"
      }
    },
    6: {
      source: "Carnival Cruise Lines",
      date: "1998",
      category: "Health & Safety",
      relatedFacts: ["Non-smoking policy", "Health regulations", "Passenger safety"],
      stats: {
        fineAmount: "$250",
        constructionLocation: "Finland",
        policyEnforcement: "Strict"
      }
    },
    7: {
      source: "Cruise Critic",
      date: "2020-2023",
      category: "Pandemic Impact",
      relatedFacts: ["COVID-19 effects", "Industry changes", "Ship retirement"],
      stats: {
        shipsScrapped: "29",
        timePeriod: "3 years",
        impactLevel: "Major"
      }
    }
  };
  
  return details[factId] || null;
};

// Custom hook for data fetching with Suspense
const useFactDetails = (factId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchFactDetails(factId);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [factId]);

  return { data, error, loading };
};

// Component that uses Suspense for data fetching
const FactDetail = ({ factId }) => {
  const { data, error, loading } = useFactDetails(factId);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="#1A3C34" variant="body2">
          Failed to load fact details
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="#1A3C34" variant="body2">
          No additional details available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: 'transparent', borderRadius: 1 }}>
      <Typography variant="h6" sx={{ color: '#1A3C34', mb: 1 }}>
        Additional Details
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={data.category} 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(30,64,52,0.08)', 
            color: '#1A3C34',
            mr: 1 
          }} 
        />
        <Typography variant="caption" sx={{ color: '#1A3C34' }}>
          Source: {data.source} • {data.date}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#1A3C34', mb: 1 }}>
          Related Facts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {data.relatedFacts.map((fact, index) => (
            <Chip
              key={index}
              label={fact}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(30,64,52,0.18)', 
                color: '#1A3C34',
                '& .MuiChip-label': { fontSize: '0.7rem' }
              }}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: '#1A3C34', mb: 1 }}>
          Key Statistics:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1 }}>
          {Object.entries(data.stats).map(([key, value]) => (
            <Box key={key} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#1A3C34', display: 'block' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1A3C34', fontWeight: 'bold' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FactDetail; 