import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';

// Data colocation: Keep data close to where it's used
const CRUISE_FACTS_DATA = [
  {
    id: 1,
    heading: "Did you know? The largest cruise ship in the world, Icon of the Seas, can hold over 7,600 passengers and features a 140,000-gallon water park!",
    text: "This massive ship, operated by Royal Caribbean, redefines luxury with its six waterslides, seven pools, and an AquaTheater, setting a new standard for cruise vacations.",
    image: "/images/Icon of the Seas.jpg",
    category: "modern",
  },
  {
    id: 2,
    heading: "Early cruise ships, like the Cunard's Britannia of 1840, even carried live cows for fresh milk.",
    text: "You can get milk by the carton or by the glass on every modern-day cruise ship. And, you could get fresh milk in 1840, too, when Cunard's first ship, Britannia, set sail across the Atlantic. The kicker? That milk came from live cows kept onboard.",
    image: "/images/Britannia of 1840.jpeg",
    category: "historical",
  },
  {
    id: 3,
    heading: "Carnival Makes 60,000 Chocolate Covered Strawberries on Just One Day",
    text: "For Valentine's Day aboard Carnival Cruise Line's fleet of Fun Ships, chefs whip up over 60,000 chocolate covered strawberries fleetwide just on February 14 each year. That's in addition to all of the sweet treats and desserts the line rolls out each and every day.",
    image: "/images/Carnival.jpg",
    category: "food",
  },
  {
    id: 4,
    heading: "Party Like It's 1999: Internet Debuts Aboard Cruise Ships",
    text: "The launch of Norwegian Cruise Line's Norwegian Sky in 1999 heralded another first: internet at sea. The ship's Internet Café was a big deal back then – so much so that it was situated along the Galleria Promenade, front and center, for all passengers to see.",
    image: "/images/Norwegian.jpg",
    category: "technology",
  },
  {
    id: 5,
    heading: "Disney Magic's Anchor Weighs as Much as Three Elephants",
    text: "Disney Cruise Line notes each anchor aboard their first ship, Disney Magic, weighs an astonishing 28,200 pounds – roughly the equivalent of three fully-grown elephants. What's more, the length of an average anchor chain aboard a cruise ship is roughly 1,000 feet, with each individual link weighing up to 130 pounds apiece. That's a lot of weight!",
    image: "/images/Disney.jpg",
    category: "engineering",
  },
  {
    id: 6,
    heading: "The First Non-Smoking Cruise Ship Debuted…25 Years Ago",
    text: "Carnival Cruise Lines was truly ahead of its time when it debuted the world's first non-smoking cruise ship back in 1998. Carnival Paradise was adorned with a gigantic no-smoking symbol emblazoned on its side (in person, you can still see it etched into the steel, beneath the bridge wings, if you look closely). The non-smoking status of Carnival Paradise wasn't just PR fluff, either: contractors who built the ship in Finland were prohibited from smoking while working on the construction and outfitting of the hull, and the fines for passengers who broke the rules were punishing: a $250 fine and removal from the ship at the next port of call.",
    image: "/images/Carnival2.jpg",
    category: "health",
  },
  {
    id: 7,
    heading: "Nearly 30 Cruise Ships Were Scrapped During the COVID-19 Pandemic",
    text: "From the 1996-built Costa Victoria to the venerable ex-ocean liner Marco Polo, nearly 30 major cruise ships were scrapped as a result of the halt in travel due to the 2020 COVID-19 pandemic. In all, Cruise Critic tracked 29 ships that went to the scrapyard between 2020 and 2023 – and several ships are still in limbo as this article was written.",
    image: "/images/Covid19.jpg",
    category: "pandemic",
  },
];

// Resource pattern for Suspense data fetching
class FactResource {
  constructor(factId) {
    this.factId = factId;
    this.promise = null;
    this.result = null;
    this.error = null;
  }

  read() {
    if (this.error) {
      throw this.error;
    }
    if (this.result) {
      return this.result;
    }
    if (!this.promise) {
      this.promise = this.fetchFactDetails();
    }
    throw this.promise;
  }

  async fetchFactDetails() {
    try {
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
      
      this.result = details[this.factId] || null;
      return this.result;
    } catch (error) {
      this.error = error;
      throw error;
    }
  }
}

// Cache for resources
const resourceCache = new Map();

const getFactResource = (factId) => {
  if (!resourceCache.has(factId)) {
    resourceCache.set(factId, new FactResource(factId));
  }
  return resourceCache.get(factId);
};

// Component that uses Suspense for data fetching
const FactDetailsWithSuspense = ({ factId }) => {
  const resource = getFactResource(factId);
  const data = resource.read();

  if (!data) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          No additional details available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
        Additional Details
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Source: {data.source} • {data.date}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Related Facts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {data.relatedFacts.map((fact, index) => (
            <Box
              key={index}
              sx={{
                px: 1,
                py: 0.5,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                fontSize: '0.7rem',
                color: 'white',
              }}
            >
              {fact}
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Key Statistics:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1 }}>
          {Object.entries(data.stats).map(([key, value]) => (
            <Box key={key} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Pre-loading utility for images
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Pre-load all images for better performance
const preloadAllImages = async () => {
  const imagePromises = CRUISE_FACTS_DATA.map(fact => preloadImage(fact.image));
  try {
    await Promise.all(imagePromises);
    console.log('All images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Custom hook for fact management with data colocation
const useFactsManager = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  const facts = useMemo(() => CRUISE_FACTS_DATA, []);

  // Pre-load images on component mount
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      await preloadAllImages();
      setPreloadedImages(new Set(facts.map(fact => fact.image)));
      setIsLoading(false);
    };
    loadImages();
  }, [facts]);

  const nextFact = useMemo(() => {
    const nextIndex = (currentIndex + 1) % facts.length;
    return facts[nextIndex];
  }, [currentIndex, facts]);

  const currentFact = facts[currentIndex];

  const rotateFact = () => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
  };

  return {
    currentFact,
    nextFact,
    isLoading,
    preloadedImages,
    rotateFact,
    totalFacts: facts.length,
    currentIndex,
  };
};

// Optimized fact display component
const FactDisplay = React.memo(({ fact, isVisible, onAnimationComplete }) => {
  const factVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={factVariants}
      onAnimationComplete={onAnimationComplete}
      key={fact.id}
    >
      <Typography
        variant="h3"
        sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'white', 
          fontFamily: 'Poppins', 
          mb: 2 
        }}
      >
        {fact.heading}
      </Typography>
      <Box sx={{ width: '4rem', height: '0.25rem', backgroundColor: 'white', mb: 3 }} />
      <Typography variant="body1" sx={{ color: 'white', fontFamily: 'Poppins' }}>
        {fact.text}
      </Typography>
    </motion.div>
  );
});

// Image component with pre-loading
const OptimizedImage = React.memo(({ src, alt, isPreloaded, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isPreloaded) {
      setImageLoaded(true);
    }
  }, [isPreloaded]);

  if (imageError) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '16rem', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 1
      }}>
        <Typography color="white">Image not available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {!imageLoaded && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="16rem" 
          sx={{ borderRadius: 1 }}
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '16rem',
          objectFit: 'cover',
          borderRadius: '4px',
          display: imageLoaded ? 'block' : 'none',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading={isPreloaded ? "eager" : "lazy"}
        {...props}
      />
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundColor: 'black', 
        opacity: 0.3, 
        borderRadius: 1 
      }} />
    </Box>
  );
});

// Main component with Suspense for data fetching
const DidYouKnowWithSuspense = () => {
  const {
    currentFact,
    nextFact,
    isLoading,
    preloadedImages,
    rotateFact,
    totalFacts,
    currentIndex,
  } = useFactsManager();

  // Auto-rotate facts
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(rotateFact, 10000);
    return () => clearInterval(interval);
  }, [rotateFact, isLoading]);

  if (isLoading) {
    return (
      <Box sx={{ py: 6, px: 2, background: 'linear-gradient(to bottom right, #1a5f7a, #2E7D32)' }}>
        <Box sx={{ maxWidth: '6xl', mx: 'auto', textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'white' }} />
          <Typography sx={{ color: 'white', mt: 2 }}>Loading cruise facts...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        background: 'linear-gradient(to bottom right, #1a5f7a, #2E7D32)',
      }}
    >
      <Box sx={{ maxWidth: '6xl', mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'Poppins',
            mb: 6,
          }}
        >
          Did You Know?
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center', 
          gap: 4 
        }}>
          <Box sx={{ width: '100%', maxWidth: { md: '50%' } }}>
            <OptimizedImage
              src={currentFact.image}
              alt={`${currentFact.heading.split('?')[0].trim()} Cruise Ship`}
              isPreloaded={preloadedImages.has(currentFact.image)}
            />
          </Box>
          
          <Box sx={{ width: '100%', maxWidth: { md: '50%' } }}>
            <FactDisplay 
              fact={currentFact} 
              isVisible={true}
            />
            
            {/* Suspense for data fetching */}
            <Box sx={{ mt: 3 }}>
              <Suspense fallback={
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="90%" height={20} />
                  </Box>
                </Box>
              }>
                <FactDetailsWithSuspense factId={currentFact.id} />
              </Suspense>
            </Box>
          </Box>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4, 
          gap: 1 
        }}>
          {Array.from({ length: totalFacts }, (_, index) => (
            <Box
              key={index}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </Box>

        {/* Pre-load next image */}
        <img 
          src={nextFact.image} 
          alt="Preload next fact" 
          style={{ display: 'none' }} 
          loading="eager" 
        />
      </Box>
    </Box>
  );
};

export default DidYouKnowWithSuspense; 