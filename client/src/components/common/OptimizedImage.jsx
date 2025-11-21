import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

const OptimizedImage = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  priority = false,
  fallbackSrc,
  className,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const imgRef = useRef(null);

  // Check WebP support
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    // Check WebP support
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);

  // Generate optimized src
  useEffect(() => {
    if (!src) return;

    const generateOptimizedSrc = () => {
      const url = new URL(src, window.location.origin);
      const pathParts = url.pathname.split('.');
      const extension = pathParts.pop();
      const baseName = pathParts.join('.');

      // Try WebP first if supported
      if (supportsWebP) {
        const webpSrc = `${baseName}.webp`;
        setCurrentSrc(webpSrc);
        return;
      }

      // Fallback to original format
      setCurrentSrc(src);
    };

    generateOptimizedSrc();
  }, [src, supportsWebP]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc && currentSrc !== src) {
      // Try fallback to original format
      setCurrentSrc(src);
      return;
    }
    
    setHasError(true);
    onError?.();
  };

  const containerStyle = {
    position: 'relative',
    width,
    height: aspectRatio ? 'auto' : height,
    overflow: 'hidden',
    ...style,
  };

  if (aspectRatio) {
    containerStyle.aspectRatio = aspectRatio;
  }

  return (
    <Box sx={containerStyle} className={className}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        />
      )}

      {/* Error Fallback */}
      {hasError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
          }}
          {...props}
        />
      )}

      {/* Main Image */}
      {currentSrc && !hasError && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          {...props}
        />
      )}

      {/* Error Message */}
      {hasError && !fallbackSrc && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          Image not available
        </Box>
      )}
    </Box>
  );
};

export default OptimizedImage; 