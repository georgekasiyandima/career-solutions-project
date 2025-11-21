import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Link,
  Checkbox,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const REMEMBER_ME_KEY = 'cs_remember_me_email';

const Login = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailInputRef = React.useRef();

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_ME_KEY);
    if (remembered) {
      setFormData((f) => ({ ...f, email: remembered }));
      setRememberMe(true);
    }
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) localStorage.removeItem(REMEMBER_ME_KEY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (rememberMe) localStorage.setItem(REMEMBER_ME_KEY, formData.email);
      else localStorage.removeItem(REMEMBER_ME_KEY);
      if (response.user?.role === 'admin' || response.user?.role === 'manager') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials or connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url(/images/pattern.svg)',
          opacity: 0.05,
          zIndex: 1,
        },
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 6,
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 4, 
            width: '100%', 
            maxWidth: 480,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box textAlign="center" mb={4}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 3,
                boxShadow: '0 8px 24px rgba(26, 95, 122, 0.3)',
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: theme.palette.text.primary }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              Sign in to your Career Solutions account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" aria-label="login form">
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                inputRef={emailInputRef}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
                inputProps={{ 'aria-label': 'email address' }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
                inputProps={{ 'aria-label': 'password' }}
              />

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={handleRememberMe} 
                      color="primary" 
                      inputProps={{ 'aria-label': 'remember me' }} 
                    />
                  }
                  label={<Typography variant="body2">Remember Me</Typography>}
                />
                <Link
                  component="button"
                  variant="body2"
                  color="primary"
                  onClick={() => navigate('/forgot-password')}
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                  aria-label="Forgot password"
                >
                  Forgot password?
                </Link>
              </Stack>

              {error && (
                <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  background: theme.palette.primary.main,
                  color: 'white',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(26, 95, 122, 0.3)',
                  '&:hover': {
                    background: theme.palette.primary.dark,
                    boxShadow: '0 6px 20px rgba(26, 95, 122, 0.4)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  }
                }}
                aria-label="Sign In"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'rgba(0, 184, 148, 0.1)', 
              p: 3, 
              borderRadius: 3, 
              mb: 3,
              border: '1px solid rgba(0, 184, 148, 0.2)',
            }}
          >
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Demo Credentials:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>Admin:</strong> admin@careersolutions.com / admin123
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>Manager:</strong> manager@careersolutions.com / manager123
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>Editor:</strong> editor@careersolutions.com / editor123
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>User:</strong> demo@careersolutions.com / user123
              </Typography>
            </Stack>
          </Paper>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                color="primary"
                onClick={() => navigate('/register')}
                underline="hover"
                sx={{ fontWeight: 600 }}
                aria-label="Contact administrator"
              >
                Contact administrator
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;