import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  useTheme,
} from '@mui/material';
import {
  FaUniversity,
  FaMobileAlt,
  FaCheckCircle,
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
} from 'react-icons/fa';
import { apiService } from '../../config/api';

const Payment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const amount = searchParams.get('amount');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('manual_deposit');
  const [paymentReference, setPaymentReference] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    } else {
      setError('Order number is required');
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      // For now, we'll use the orderNumber to find the order
      // In production, you'd have a proper endpoint
      const response = await apiService.getServiceOrders({ orderNumber });
      if (response.data && response.data.length > 0) {
        setOrder(response.data[0]);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!paymentReference.trim()) {
      setError('Please enter your payment reference number');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Find order ID from orderNumber
      const ordersResponse = await apiService.getServiceOrders({ orderNumber });
      if (ordersResponse.data && ordersResponse.data.length > 0) {
        const orderId = ordersResponse.data[0].id;
        
        // Mark as pending - admin will verify and update to paid
        const paymentData = {
          paymentStatus: 'pending_verification',
          paymentMethod: paymentMethod,
          paymentReference: paymentReference.trim(),
        };

        await apiService.updatePaymentStatus(orderId, paymentData);
        
        setSuccess(true);
        
        // Redirect after 5 seconds
        setTimeout(() => {
          navigate('/services?payment=pending');
        }, 5000);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError(err.message || 'Failed to submit payment confirmation. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const displayAmount = amount || order?.amount || 0;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', py: 8 }}>
      <Container maxWidth="md">
        {success ? (
          <Card sx={{ textAlign: 'center', p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(11, 68, 74, 0.1)' }}>
            <FaCheckCircle style={{ fontSize: 64, color: '#0B444A', marginBottom: 16 }} />
            <Typography variant="h4" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif', color: '#0B444A' }}>
              Payment Confirmation Submitted!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
              Thank you for submitting your payment confirmation. Our team will verify your payment and begin processing your order.
            </Typography>
            <Alert severity="info" sx={{ mt: 3, textAlign: 'left', fontFamily: '"Josefin Sans", sans-serif' }}>
              <Typography variant="body2" sx={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                <strong>What happens next?</strong><br />
                1. We will verify your payment (usually within 1-2 business days)<br />
                2. You will receive an email confirmation once payment is verified<br />
                3. We will begin processing your service order<br />
                4. You'll receive updates via email throughout the process
              </Typography>
            </Alert>
            <Typography variant="body2" sx={{ mt: 3, color: '#64748b', fontFamily: '"Josefin Sans", sans-serif' }}>
              Order Number: {orderNumber}<br />
              Payment Reference: {paymentReference}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontFamily: '"Josefin Sans", sans-serif' }}>
              Redirecting to services page...
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(11, 68, 74, 0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 4, fontFamily: '"Josefin Sans", sans-serif', color: '#0B444A' }}>
                Complete Your Payment
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Order Summary */}
              <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif' }}>
                  Order Summary
                </Typography>
                {order && (
                  <>
                    <Typography variant="body1" sx={{ mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                      <strong>Order Number:</strong> {order.order_number}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontFamily: '"Josefin Sans", sans-serif' }}>
                      <strong>Service:</strong> {order.service_name}
                    </Typography>
                  </>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B444A', fontFamily: '"Josefin Sans", sans-serif' }}>
                    R{displayAmount}
                  </Typography>
                </Box>
              </Box>

              {/* Payment Methods */}
              <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Josefin Sans", sans-serif' }}>
                Select Payment Method
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant={paymentMethod === 'manual_deposit' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setPaymentMethod('manual_deposit');
                    setShowInstructions(true);
                  }}
                  startIcon={<FaUniversity />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: paymentMethod === 'manual_deposit' ? '#0B444A' : 'transparent',
                    borderColor: '#0B444A',
                    color: paymentMethod === 'manual_deposit' ? '#ffffff' : '#0B444A',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'manual_deposit' ? '#13484C' : 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  Manual Bank Deposit / EFT
                </Button>
                <Button
                  variant={paymentMethod === 'e_wallet' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setPaymentMethod('e_wallet');
                    setShowInstructions(true);
                  }}
                  startIcon={<FaWallet />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: paymentMethod === 'e_wallet' ? '#0B444A' : 'transparent',
                    borderColor: '#0B444A',
                    color: paymentMethod === 'e_wallet' ? '#ffffff' : '#0B444A',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'e_wallet' ? '#13484C' : 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  E-Wallet Transfer
                </Button>
                <Button
                  variant={paymentMethod === 'cash_send' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setPaymentMethod('cash_send');
                    setShowInstructions(true);
                  }}
                  startIcon={<FaMoneyBillWave />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: paymentMethod === 'cash_send' ? '#0B444A' : 'transparent',
                    borderColor: '#0B444A',
                    color: paymentMethod === 'cash_send' ? '#ffffff' : '#0B444A',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'cash_send' ? '#13484C' : 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  Cash Send
                </Button>
                <Button
                  variant={paymentMethod === 'wicode_mukuru' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setPaymentMethod('wicode_mukuru');
                    setShowInstructions(true);
                  }}
                  startIcon={<FaExchangeAlt />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: paymentMethod === 'wicode_mukuru' ? '#0B444A' : 'transparent',
                    borderColor: '#0B444A',
                    color: paymentMethod === 'wicode_mukuru' ? '#ffffff' : '#0B444A',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'wicode_mukuru' ? '#13484C' : 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  WiCode / Mukuru
                </Button>
                <Button
                  variant={paymentMethod === 'mobile_wallet' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setPaymentMethod('mobile_wallet');
                    setShowInstructions(true);
                  }}
                  startIcon={<FaMobileAlt />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontFamily: '"Josefin Sans", sans-serif',
                    backgroundColor: paymentMethod === 'mobile_wallet' ? '#0B444A' : 'transparent',
                    borderColor: '#0B444A',
                    color: paymentMethod === 'mobile_wallet' ? '#ffffff' : '#0B444A',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'mobile_wallet' ? '#13484C' : 'rgba(11, 68, 74, 0.05)',
                    },
                  }}
                >
                  Mobile Wallet (Other)
                </Button>
              </Stack>

              {/* Payment Instructions */}
              {showInstructions && (
                <Box sx={{ mb: 4 }}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mb: 3,
                      '& .MuiAlert-message': {
                        width: '100%',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Josefin Sans", sans-serif', fontWeight: 600 }}>
                      Payment Instructions - {paymentMethod === 'manual_deposit' ? 'Manual Bank Deposit' :
                                            paymentMethod === 'e_wallet' ? 'E-Wallet Transfer' :
                                            paymentMethod === 'cash_send' ? 'Cash Send' :
                                            paymentMethod === 'wicode_mukuru' ? 'WiCode / Mukuru' :
                                            'Mobile Wallet'}
                    </Typography>
                    
                    <Box component="div" sx={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                      <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                        Bank Details:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mb: 2, listStyle: 'none' }}>
                        <Box component="li" sx={{ mb: 1 }}>
                          <strong>Bank:</strong> Capitec Bank
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <strong>Account Number:</strong> [XXXXXXXXXX]
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <strong>Account Type:</strong> Current Account
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <strong>Branch Code:</strong> [XXX]
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <strong>Reference:</strong> {orderNumber}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
                        Important:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mb: 0, listStyle: 'disc' }}>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          Always use <strong>{orderNumber}</strong> as your payment reference
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          Payment amount: <strong>R{displayAmount}</strong>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          After making payment, enter your payment reference below
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          We will verify your payment and begin processing your order
                        </Box>
                        <Box component="li" sx={{ mb: 0 }}>
                          Processing typically takes 1-2 business days after payment verification
                        </Box>
                      </Box>
                    </Box>
                  </Alert>
                </Box>
              )}

              {/* Payment Reference Input */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Payment Reference Number"
                  placeholder="Enter the reference number from your payment (e.g., transaction ID, receipt number)"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  required
                  helperText="This is the reference number you received when making the payment"
                  sx={{
                    fontFamily: '"Josefin Sans", sans-serif',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0B444A',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0B444A',
                      },
                    },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePaymentConfirmation}
                disabled={processing || !paymentReference.trim()}
                sx={{
                  backgroundColor: '#0B444A',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: '"Josefin Sans", sans-serif',
                  '&:hover': {
                    backgroundColor: '#13484C',
                  },
                  '&:disabled': {
                    backgroundColor: '#94a3b8',
                  },
                }}
              >
                {processing ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2, color: '#ffffff' }} />
                    Submitting...
                  </>
                ) : (
                  'Confirm Payment Made'
                )}
              </Button>

              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2, 
                  textAlign: 'center', 
                  color: '#64748b',
                  fontFamily: '"Josefin Sans", sans-serif',
                }}
              >
                After making your payment, click the button above to confirm. Our team will verify and process your order.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default Payment;

