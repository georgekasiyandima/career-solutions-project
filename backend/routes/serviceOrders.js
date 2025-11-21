const express = require('express');
const router = express.Router();
const db = require('../database');
const EmailService = require('../utils/emailService');
const sendEmail = require('../utils/sendEmail');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CS-${timestamp}-${random}`;
};

// POST /api/service-orders - Create a new service order
router.post('/', async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      price,
      formData,
      source = 'website',
    } = req.body;

    // Validate required fields
    if (!serviceId || !serviceName || !price || !formData) {
      return res.status(400).json({ 
        message: 'Missing required fields: serviceId, serviceName, price, and formData are required' 
      });
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      return res.status(400).json({ 
        message: 'Missing required client information: fullName, email, and phone are required' 
      });
    }

    const orderNumber = generateOrderNumber();

    // Create service order
    const [order] = await db('service_orders')
      .insert({
        order_number: orderNumber,
        service_id: serviceId,
        service_name: serviceName,
        amount: parseFloat(price),
        status: 'pending',
        payment_status: 'pending',
        client_name: formData.fullName,
        client_email: formData.email,
        client_phone: formData.phone,
        client_country: formData.country || null,
        service_data: JSON.stringify(formData),
        source: source,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning('*');

    // Track analytics - Service Selection
    await db('business_analytics').insert({
      service_id: serviceId,
      service_name: serviceName,
      service_category: getServiceCategory(serviceId),
      client_email: formData.email,
      country_of_origin: formData.country || null,
      enquiry_type: 'service_selected',
      conversion_stage: 'selection',
      converted: false,
      source: source,
      event_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    // Send confirmation email
    try {
      await EmailService.sendOrderConfirmation({
        orderNumber: order.order_number,
        serviceName: serviceName,
        amount: price,
        clientName: formData.fullName,
        clientEmail: formData.email,
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Service order created successfully',
      orderId: order.id,
      orderNumber: order.order_number,
      order: order,
    });
  } catch (err) {
    console.error('Error creating service order:', err);
    res.status(500).json({ 
      message: 'Error creating service order',
      error: err.message 
    });
  }
});

// GET /api/service-orders/:orderId - Get order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await db('service_orders')
      .where({ id: orderId })
      .first();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Parse JSON fields
    if (order.service_data) {
      order.service_data = JSON.parse(order.service_data);
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// PATCH /api/service-orders/:orderId/payment - Update payment status
router.patch('/:orderId/payment', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentMethod, paymentReference } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: 'paymentStatus is required' });
    }

    const updateData = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    };

    if (paymentMethod) updateData.payment_method = paymentMethod;
    if (paymentReference) updateData.payment_reference = paymentReference;
    
    // Handle different payment statuses
    if (paymentStatus === 'paid') {
      updateData.paid_at = new Date().toISOString();
      updateData.status = 'processing';
    } else if (paymentStatus === 'pending_verification') {
      // Keep status as pending, admin will verify and update to paid
      updateData.status = 'pending';
    } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
      updateData.status = 'cancelled';
    }

    const [updatedOrder] = await db('service_orders')
      .where({ id: orderId })
      .update(updateData)
      .returning('*');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Track analytics and send emails based on payment status
    const order = await db('service_orders').where({ id: orderId }).first();
    const serviceData = order.service_data ? JSON.parse(order.service_data) : {};

    if (paymentStatus === 'paid') {
      // Track successful payment
      await db('business_analytics').insert({
        service_id: order.service_id,
        service_name: order.service_name,
        service_category: getServiceCategory(order.service_id),
        client_email: order.client_email,
        country_of_origin: order.client_country,
        enquiry_type: 'payment_made',
        conversion_stage: 'payment',
        converted: true,
        revenue: parseFloat(order.amount),
        source: order.source,
        event_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      // Send payment confirmation and service information
      try {
        await EmailService.sendPaymentConfirmation({
          orderNumber: order.order_number,
          serviceName: order.service_name,
          amount: order.amount,
          clientName: order.client_name,
          clientEmail: order.client_email,
          serviceData: serviceData,
        });
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }
    } else if (paymentStatus === 'pending_verification') {
      // Track pending verification
      await db('business_analytics').insert({
        service_id: order.service_id,
        service_name: order.service_name,
        service_category: getServiceCategory(order.service_id),
        client_email: order.client_email,
        country_of_origin: order.client_country,
        enquiry_type: 'payment_pending',
        conversion_stage: 'payment',
        converted: false,
        source: order.source,
        event_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      // Send admin notification for payment verification
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@careersolutions.com';
        const subject = `Payment Pending Verification - Order ${order.order_number}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0B444A;">Payment Pending Verification</h2>
            <p>A client has submitted a payment confirmation that requires verification:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Service:</strong> ${order.service_name}</p>
              <p><strong>Amount:</strong> R${order.amount}</p>
              <p><strong>Client:</strong> ${order.client_name} (${order.client_email})</p>
              <p><strong>Payment Method:</strong> ${paymentMethod || 'N/A'}</p>
              <p><strong>Payment Reference:</strong> ${paymentReference || 'N/A'}</p>
            </div>
            <p>Please verify the payment and update the order status accordingly.</p>
          </div>
        `;
        const text = `Payment pending verification for order ${order.order_number} - ${order.service_name} - R${order.amount}`;
        
        await sendEmail(adminEmail, subject, text, html);
        console.log(`Admin notification sent for payment verification ${order.order_number}`);
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    res.json({
      message: 'Payment status updated successfully',
      order: updatedOrder,
    });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ 
      message: 'Error updating payment status',
      error: err.message 
    });
  }
});

// GET /api/service-orders - Get all orders (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, paymentStatus, email, orderNumber, limit = 50, offset = 0 } = req.query;
    
    let query = db('service_orders').select('*');

    if (status) {
      query = query.where('status', status);
    }
    if (paymentStatus) {
      query = query.where('payment_status', paymentStatus);
    }
    if (email) {
      query = query.where('client_email', email);
    }
    if (orderNumber) {
      query = query.where('order_number', orderNumber);
    }

    const orders = await query
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    // Parse JSON fields
    orders.forEach(order => {
      if (order.service_data) {
        try {
          order.service_data = JSON.parse(order.service_data);
        } catch (e) {
          order.service_data = {};
        }
      }
    });

    // If orderNumber was provided and we found orders, return as array for consistency
    // Otherwise return the orders array
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Helper function to get service category
function getServiceCategory(serviceId) {
  if (serviceId.includes('resume')) return 'resume';
  if (serviceId.includes('visa')) return 'visa';
  if (serviceId.includes('cover')) return 'cover-letter';
  return 'other';
}

module.exports = router;

