# 🚀 Getty Jobboard Website

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, full-stack web application for job posting and career solutions, built with React (frontend) and Node.js/Express (backend). Features real-time job management, user authentication, booking systems, and performance-optimized components.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance Optimizations](#-performance-optimizations)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **📝 Job Posting & Management**: Create, edit, and manage job listings
- **🔐 User Authentication**: Secure JWT-based user registration and login
- **📅 Booking System**: Schedule appointments and consultations
- **📧 Enquiry Management**: Handle customer inquiries efficiently
- **🏆 Success Stories**: Showcase successful career transitions
- **📱 Feed System**: Social media-like feed for updates
- **📊 Analytics**: Real-time tracking and analytics

### 🎨 User Experience
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX
- **⚡ Performance Optimized**: Fast loading with pre-loading and code splitting
- **♿ Accessibility**: WCAG 2.1 compliant
- **🌐 Progressive Web App**: Offline capabilities
- **🔍 SEO Optimized**: Meta tags and structured data

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern React with hooks and functional components |
| **Material-UI** | Component library for consistent design |
| **Framer Motion** | Smooth animations and transitions |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API calls |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **Knex.js** | SQL query builder |
| **SQLite** | Lightweight database |
| **JWT** | JSON Web Tokens for authentication |
| **Nodemailer** | Email functionality |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/georgekasiyandima/career-solutions-typescript.git
cd Getty\ Jobboard\ Website

# Install dependencies
cd backend && npm install
cd ../client && npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp client/.env.example client/.env

# Start development servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd client && npm start
```

Visit `http://localhost:3000` to see the application running!

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **Git** - [Download here](https://git-scm.com/)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/georgekasiyandima/career-solutions-typescript.git
   cd Getty\ Jobboard\ Website
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cd ../backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../client
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up the database**
   ```bash
   cd ../backend
   npm run migrate
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/users/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### POST `/api/users/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### Job Management Endpoints

#### GET `/api/jobs`
Retrieve all job listings with pagination.

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of jobs per page
- `search` (string): Search term for job titles
- `category` (string): Filter by job category

#### POST `/api/jobs`
Create a new job listing (requires authentication).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "company": "string",
  "location": "string",
  "salary": "string",
  "type": "full-time|part-time|contract"
}
```

### Booking Endpoints

#### POST `/api/bookings`
Create a new booking appointment.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "service": "string",
  "message": "string"
}
```

## 📁 Project Structure

```
Getty Jobboard Website/
├── 📁 client/                    # Frontend React application
│   ├── 📁 public/               # Static assets
│   │   ├── 📁 images/          # Image assets
│   │   ├── index.html          # HTML template
│   │   └── manifest.json       # PWA manifest
│   ├── 📁 src/                 # Source code
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 utils/           # Utility functions
│   │   ├── 📁 __tests__/       # Test files
│   │   ├── App.jsx             # Main App component
│   │   └── index.jsx           # Entry point
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Tailwind configuration
├── 📁 backend/                  # Backend Node.js application
│   ├── 📁 routes/              # API routes
│   ├── 📁 middleware/          # Custom middleware
│   ├── 📁 migrations/          # Database migrations
│   ├── 📁 seeds/               # Database seeders
│   ├── 📁 utils/               # Utility functions
│   ├── server.js               # Express server
│   ├── package.json            # Backend dependencies
│   └── knexfile.js             # Database configuration
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
└── package.json                # Root package.json
```

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=./database.sqlite

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development

# Analytics
REACT_APP_GA_TRACKING_ID=your_google_analytics_id

# Feature Flags
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=true
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd client
npm test

# Run tests with coverage
npm run test:coverage
```

### Testing Technologies
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Supertest** - API testing

## 📦 Deployment

### Production Deployment

#### Backend Deployment (Heroku/Railway/Render)

1. **Set up environment variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Run database migrations**
   ```bash
   npm run migrate:production
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

#### Frontend Deployment (Vercel/Netlify)

1. **Build the production version**
   ```bash
   npm run build
   ```

2. **Deploy the build folder**
   - Upload to your hosting service
   - Configure environment variables
   - Set up custom domain (optional)

## ⚡ Performance Optimizations

### Frontend Optimizations
- **🚀 Code Splitting**: Lazy loading for better initial load times
- **🖼️ Image Optimization**: WebP format with fallbacks
- **💾 Caching**: Service worker for offline capabilities
- **🎯 Bundle Optimization**: Tree shaking and minification
- **⚡ Pre-loading**: Critical resources loaded first

### Backend Optimizations
- **🗄️ Database Indexing**: Optimized queries with proper indexes
- **🔄 Connection Pooling**: Efficient database connections
- **📦 Compression**: Gzip compression for responses
- **⏱️ Rate Limiting**: Protection against abuse
- **🔍 Query Optimization**: Efficient database queries

### Component Optimizations
- **DidYouKnow**: Interactive fact carousel with pre-loading and Suspense
- **JobDetails**: Optimized rendering with React.memo
- **BookingForm**: Form validation and error handling
- **Feed**: Virtual scrolling for large datasets

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Submit a pull request**

### Code Standards
- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **Conventional Commits** for commit messages

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues

**Port already in use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**Database connection issues**
```bash
# Check database file exists
ls -la backend/database.sqlite
# Reset database
npm run migrate:reset
```

#### Frontend Issues

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not loading**
```bash
# Restart development server
npm start
```

### Getting Help

- 📖 [Documentation](docs/)
- 🐛 [Report a Bug](https://github.com/georgekasiyandima/career-solutions-typescript/issues)
- 💡 [Request a Feature](https://github.com/georgekasiyandima/career-solutions-typescript/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**George Kasiyandima**
- 🌐 [Portfolio](https://georgekasiyandima.dev)
- 💼 [LinkedIn](https://linkedin.com/in/georgekasiyandima)
- 🐦 [Twitter](https://twitter.com/georgekasiyandima)
- 📧 [Email](mailto:george@yourdomain.com)

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Material-UI** - For the component library
- **Express.js Community** - For the robust backend framework
- **Open Source Contributors** - For all the amazing tools and libraries

## 📈 Project Status

- ✅ **Phase 1**: Core functionality (Complete)
- ✅ **Phase 2**: Performance optimizations (Complete)
- 🔄 **Phase 3**: Advanced features (In Progress)
- 📋 **Phase 4**: Mobile app (Planned)

---

<div align="center">

**Made with ❤️ by George Kasiyandima**

For detailed performance optimization strategies, check out the [OPTIMIZATION_GUIDE.md](client/OPTIMIZATION_GUIDE.md).

</div> 