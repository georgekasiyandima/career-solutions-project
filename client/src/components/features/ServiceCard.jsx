import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { 
  FaFileAlt, 
  FaEnvelope, 
  FaPassport, 
  FaShip, 
  FaGlobe, 
  FaLaptop,
  FaBriefcase,
  FaPlane,
  FaAnchor,
  FaUserTie,
  FaGraduationCap,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaCertificate,
  FaSearch,
  FaClipboardList,
  FaCalendarCheck,
  FaMapMarkedAlt,
  FaBuilding
} from 'react-icons/fa';

const iconMap = {
  FaFileAlt,
  FaEnvelope,
  FaPassport,
  FaShip,
  FaGlobe,
  FaLaptop,
  FaBriefcase,
  FaPlane,
  FaAnchor,
  FaUserTie,
  FaGraduationCap,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaCertificate,
  FaSearch,
  FaClipboardList,
  FaCalendarCheck,
  FaMapMarkedAlt,
  FaBuilding
};

const ServiceCard = ({ service, onClick, className = "" }) => {
  const Icon = service.icon || iconMap[service.icon];

  return (
    <Card
      className={className}
      onClick={onClick}
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)'
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Service Icon and Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          {Icon && (
            <Box sx={{ 
              width: 56, 
              height: 56, 
              backgroundColor: '#2563eb', 
              borderRadius: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 2 
            }}>
              <Icon style={{ fontSize: 24, color: 'white' }} />
            </Box>
          )}
          <Typography variant="h5" sx={{ 
            color: '#1e293b', 
            fontWeight: 600, 
            textAlign: 'center' 
          }}>
            {service.title}
          </Typography>
        </Box>

        {/* Service Description */}
        {service.description && (
          <Typography variant="body1" sx={{ 
            color: '#64748b', 
            textAlign: 'center', 
            mb: 3, 
            flexGrow: 1 
          }}>
            {service.description}
          </Typography>
        )}

        {/* Packages Preview */}
        {service.packages && service.packages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {service.packages.slice(0, 2).map((pkg, idx) => (
              <Box key={idx} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {pkg.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#2563eb', 
                  fontWeight: 600 
                }}>
                  {pkg.price}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* CTA Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mt: 'auto' 
        }}>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {service.packages ? `${service.packages.length} package${service.packages.length > 1 ? 's' : ''}` : 'Learn More'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;