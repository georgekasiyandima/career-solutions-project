# Career Solutions API Documentation

## Overview

The Career Solutions API provides comprehensive endpoints for managing job postings, user administration, analytics, content management, and security features. This RESTful API is built with Node.js, Express, and includes advanced security features.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.careersolutions.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@careersolutions.com",
  "password": "Admin123!"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/validate-token` | Validate JWT token | No |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | Get all jobs | No |
| GET | `/api/jobs/:id` | Get job by ID | No |
| POST | `/api/jobs` | Create new job | Admin |
| PUT | `/api/jobs/:id` | Update job | Admin |
| DELETE | `/api/jobs/:id` | Delete job | Admin |
| GET | `/api/jobs/featured` | Get featured jobs | No |
| GET | `/api/jobs/stats` | Get job statistics | Admin |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/booking` | Get all bookings | Admin |
| GET | `/api/booking/:id` | Get booking by ID | Admin |
| POST | `/api/booking` | Create booking | No |
| PUT | `/api/booking/:id` | Update booking | Admin |
| DELETE | `/api/booking/:id` | Delete booking | Admin |

### Enquiries

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/enquiry` | Get all enquiries | Admin |
| GET | `/api/enquiry/:id` | Get enquiry by ID | Admin |
| POST | `/api/enquiry` | Create enquiry | No |
| PUT | `/api/enquiry/:id` | Update enquiry | Admin |
| DELETE | `/api/enquiry/:id` | Delete enquiry | Admin |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/overview` | Get analytics overview | Admin |
| GET | `/api/analytics/detailed` | Get detailed analytics | Admin |
| GET | `/api/analytics/trends` | Get analytics trends | Admin |
| GET | `/api/analytics/export` | Export analytics data | Admin |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| POST | `/api/users/bulk` | Bulk user operations | Admin |

### Content Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/content` | Get all content | Admin |
| GET | `/api/content/:id` | Get content by ID | Admin |
| POST | `/api/content` | Create content | Admin |
| PUT | `/api/content/:id` | Update content | Admin |
| DELETE | `/api/content/:id` | Delete content | Admin |
| POST | `/api/content/publish/:id` | Publish content | Admin |

### Security

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/security/stats` | Get security statistics | Admin |
| GET | `/api/security/alerts` | Get security alerts | Admin |
| GET | `/api/security/suspicious` | Get suspicious activities | Admin |
| GET | `/api/security/blocked-ips` | Get blocked IPs | Admin |
| POST | `/api/security/block-ip` | Block IP address | Admin |
| POST | `/api/security/unblock-ip` | Unblock IP address | Admin |
| GET | `/api/security/export-logs` | Export security logs | Admin |

### Search

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/search` | Global search | No |
| GET | `/api/search/advanced` | Advanced search | No |
| GET | `/api/search/suggestions` | Search suggestions | No |

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful" // Optional
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Optional validation errors
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **General API endpoints**: 100 requests per 15 minutes
- **WebSocket connections**: 10 connections per minute

## Security Features

### Input Validation
- All inputs are validated and sanitized
- SQL injection prevention
- XSS attack protection
- File upload security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management
- Password strength validation

### Monitoring & Alerting
- Real-time security monitoring
- Suspicious activity detection
- IP blocking system
- Audit logging

## WebSocket API

The application also provides real-time functionality via WebSocket connections:

### Connection
```
ws://localhost:5000?token=<jwt-token>
```

### Message Types

| Type | Description | Data |
|------|-------------|------|
| `ping` | Keep-alive ping | None |
| `pong` | Keep-alive response | `{ timestamp }` |
| `request_analytics` | Request analytics data | `{ filters }` |
| `analytics_update` | Analytics data update | `{ analytics }` |
| `request_notifications` | Request notifications | None |
| `notification` | New notification | `{ notification }` |
| `user_activity` | User activity broadcast | `{ activity }` |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Examples

### Create a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "New York, NY",
    "description": "We are looking for a senior software engineer...",
    "requirements": "7+ years experience, React, Node.js",
    "salary_range": "$120,000 - $180,000"
  }'
```

### Get Analytics

```bash
curl -X GET http://localhost:5000/api/analytics/overview \
  -H "Authorization: Bearer <token>"
```

### Search Jobs

```bash
curl -X GET "http://localhost:5000/api/search?q=software%20engineer&type=jobs"
```

## SDKs and Libraries

### JavaScript/Node.js

```javascript
const api = {
  baseURL: 'http://localhost:5000',
  token: null,
  
  setToken(token) {
    this.token = token;
  },
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    return response.json();
  },
  
  // Authentication
  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.setToken(response.token);
    }
    
    return response;
  },
  
  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/jobs?${query}`);
  },
  
  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }
};
```

## Testing

### Using Postman

1. Import the API collection
2. Set the base URL to `http://localhost:5000`
3. Use the login endpoint to get a token
4. Set the Authorization header with the token
5. Test all endpoints

### Using curl

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careersolutions.com","password":"Admin123!"}' \
  | jq -r '.token')

# Use token for authenticated requests
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN"
```

## Support

For API support and questions:

- **Email**: api-support@careersolutions.com
- **Documentation**: https://docs.careersolutions.com/api
- **Status Page**: https://status.careersolutions.com

## Changelog

### v1.0.0 (Current)
- Initial API release
- Authentication system
- Job management
- Analytics dashboard
- Security features
- WebSocket support
- Comprehensive documentation 