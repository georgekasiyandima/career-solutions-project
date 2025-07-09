# Career Solutions - Project Structure

## Overview

This document outlines the complete project structure for Career Solutions, following industry best practices and modern development standards.

## Root Directory Structure

```
Career Solutions/
├── 📁 client/                    # React Frontend Application
├── 📁 backend/                   # Node.js/Express Backend Application
├── 📁 docs/                      # Project Documentation
├── 📁 scripts/                   # Build and Deployment Scripts
├── 📄 package.json               # Root package.json (Monorepo management)
├── 📄 docker-compose.yml         # Docker orchestration
├── 📄 Dockerfile                 # Backend Docker configuration
├── 📄 .gitignore                 # Git ignore rules
├── 📄 env.example                # Environment variables template
├── 📄 README.md                  # Project overview and setup
└── 📄 PROJECT_STRUCTURE.md       # This file
```

## Frontend Structure (`client/`)

```
client/
├── 📁 public/                    # Static assets served by web server
│   ├── 📄 index.html             # HTML template
│   ├── 📄 manifest.json          # PWA manifest
│   ├── 📄 robots.txt             # SEO robots file
│   └── 📁 images/                # Public images
├── 📁 src/                       # Source code
│   ├── 📁 components/            # React components
│   │   ├── 📁 common/            # Reusable components
│   │   │   ├── 📄 Modal.jsx
│   │   │   ├── 📄 ErrorBoundary.jsx
│   │   │   └── 📄 LoadingSpinner.jsx
│   │   ├── 📁 layout/            # Layout components
│   │   │   ├── 📄 Header.jsx
│   │   │   ├── 📄 Footer.jsx
│   │   │   └── 📄 Navigation.jsx
│   │   ├── 📁 forms/             # Form components
│   │   │   ├── 📄 BookingForm.jsx
│   │   │   ├── 📄 EnquiryForm.jsx
│   │   │   └── 📄 ContactForm.jsx
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── 📄 AboutUs.jsx
│   │   │   ├── 📄 Services.jsx
│   │   │   ├── 📄 Jobs.jsx
│   │   │   ├── 📄 SuccessStories.jsx
│   │   │   ├── 📄 FAQ.jsx
│   │   │   ├── 📄 Testimonials.jsx
│   │   │   └── 📄 Hired.jsx
│   │   └── 📁 features/          # Feature-specific components
│   │       ├── 📄 HeroSection.jsx
│   │       ├── 📄 ServiceCard.jsx
│   │       ├── 📄 JobDetails.jsx
│   │       ├── 📄 DidYouKnow.jsx
│   │       ├── 📄 DidYouKnowOptimized.jsx
│   │       ├── 📄 DidYouKnowWithSuspense.jsx
│   │       ├── 📄 FactDetail.jsx
│   │       ├── 📄 Feed.jsx
│   │       └── 📄 WhatsAppWidget.jsx
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📄 useAuth.js
│   │   ├── 📄 useApi.js
│   │   ├── 📄 useLocalStorage.js
│   │   └── 📄 useDebounce.js
│   ├── 📁 context/               # React context providers
│   │   ├── 📄 AuthContext.jsx
│   │   ├── 📄 ThemeContext.jsx
│   │   └── 📄 AppContext.jsx
│   ├── 📁 services/              # API services and utilities
│   │   ├── 📄 api.js
│   │   ├── 📄 authService.js
│   │   ├── 📄 jobService.js
│   │   ├── 📄 bookingService.js
│   │   ├── 📄 formUtils.js
│   │   └── 📄 trackEvent.js
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── 📄 user.types.ts
│   │   ├── 📄 job.types.ts
│   │   ├── 📄 booking.types.ts
│   │   └── 📄 api.types.ts
│   ├── 📁 constants/             # Application constants
│   │   ├── 📄 routes.js
│   │   ├── 📄 messages.js
│   │   └── 📄 validation.js
│   ├── 📁 config/                # Configuration files
│   │   ├── 📄 constants.js
│   │   ├── 📄 api.js
│   │   └── 📄 theme.js
│   ├── 📁 assets/                # Static assets
│   │   ├── 📁 images/            # Image assets
│   │   ├── 📁 icons/             # Icon assets
│   │   │   └── 📄 logo.svg
│   │   └── 📁 styles/            # Style files
│   │       ├── 📄 global.css
│   │       └── 📄 index.css
│   ├── 📁 __tests__/             # Test files
│   │   ├── 📄 AboutUs.test.js
│   │   ├── 📄 DidYouKnow.test.js
│   │   ├── 📄 Footer.test.js
│   │   ├── 📄 Header.test.js
│   │   ├── 📄 HeroSection.test.js
│   │   └── 📄 formUtils.test.jsx
│   ├── 📄 App.jsx                # Main App component
│   ├── 📄 App.test.js            # App component tests
│   ├── 📄 index.jsx              # Application entry point
│   ├── 📄 setupTests.js          # Test setup configuration
│   └── 📄 jest.config.js         # Jest configuration
├── 📁 build/                     # Production build output
├── 📄 package.json               # Frontend dependencies
├── 📄 package-lock.json          # Dependency lock file
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 .babelrc                   # Babel configuration
├── 📄 .gitignore                 # Frontend-specific git ignore
├── 📄 Dockerfile                 # Frontend Docker configuration
├── 📄 nginx.conf                 # Nginx configuration for production
└── 📄 OPTIMIZATION_GUIDE.md      # Performance optimization guide
```

## Backend Structure (`backend/`)

```
backend/
├── 📁 config/                    # Configuration files
│   ├── 📄 database.js            # Database configuration
│   ├── 📄 constants.js           # Application constants
│   └── 📄 knexfile.js            # Knex database configuration
├── 📁 controllers/               # Request handlers
│   ├── 📄 userController.js
│   ├── 📄 jobController.js
│   ├── 📄 bookingController.js
│   ├── 📄 enquiryController.js
│   ├── 📄 successStoryController.js
│   ├── 📄 feedController.js
│   ├── 📄 adminController.js
│   └── 📄 trackController.js
├── 📁 models/                    # Data models
│   ├── 📄 User.js
│   ├── 📄 Job.js
│   ├── 📄 Booking.js
│   ├── 📄 Enquiry.js
│   ├── 📄 SuccessStory.js
│   └── 📄 FeedPost.js
├── 📁 routes/                    # API route definitions
│   ├── 📄 users.js
│   ├── 📄 jobs.js
│   ├── 📄 bookings.js
│   ├── 📄 enquiries.js
│   ├── 📄 successStories.js
│   ├── 📄 feed.js
│   ├── 📄 admin.js
│   ├── 📄 subscriptions.js
│   └── 📄 track.js
├── 📁 middleware/                # Custom middleware
│   ├── 📁 auth/                  # Authentication middleware
│   │   ├── 📄 auth.js
│   │   ├── 📄 jwt.js
│   │   └── 📄 roles.js
│   ├── 📁 validation/            # Input validation middleware
│   │   ├── 📄 userValidation.js
│   │   ├── 📄 jobValidation.js
│   │   └── 📄 bookingValidation.js
│   └── 📁 error/                 # Error handling middleware
│       ├── 📄 errorHandler.js
│       ├── 📄 notFound.js
│       └── 📄 asyncHandler.js
├── 📁 utils/                     # Utility functions
│   ├── 📁 database/              # Database utilities
│   │   ├── 📄 connection.js
│   │   └── 📄 queries.js
│   ├── 📁 email/                 # Email utilities
│   │   ├── 📄 sendEmail.js
│   │   └── 📄 templates.js
│   └── 📁 validation/            # Validation utilities
│       ├── 📄 validators.js
│       └── 📄 sanitizers.js
├── 📁 migrations/                # Database migrations
│   ├── 📄 20250417235415_create_initial_tables.js
│   ├── 📄 20250418000429_add_created_at_columns.js
│   ├── 📄 20250418004208_create_jobs_table.js
│   ├── 📄 20250418194123_create_feed_posts_table.js
│   ├── 📄 20250418195753_create_success_stories_table.js
│   ├── 📄 20250419041815_create_tracking_events_table.js
│   ├── 📄 20250420213023_update_bookings_and_enquiries_schema.js
│   └── 📄 20250521012203_make_phone_nullable.js
├── 📁 seeds/                     # Database seeders
│   ├── 📄 initial_feed_posts.js
│   ├── 📄 initial_jobs.js
│   └── 📄 intial_success_stories.js
├── 📁 docs/                      # API documentation
│   ├── 📄 swagger.json
│   ├── 📄 postman_collection.json
│   └── 📄 api_documentation.md
├── 📁 public/                    # Static files served by Express
│   ├── 📁 uploads/               # File uploads
│   └── 📁 assets/                # Static assets
├── 📄 server.js                  # Express server entry point
├── 📄 database.js                # Database connection (legacy)
├── 📄 testHash.js                # Testing utilities
├── 📄 package.json               # Backend dependencies
├── 📄 package-lock.json          # Dependency lock file
├── 📄 database.sqlite            # SQLite database file
└── 📄 db.sqlite                  # Alternative database file
```

## Documentation Structure (`docs/`)

```
docs/
├── 📁 api/                       # API documentation
│   ├── 📄 endpoints.md           # API endpoints reference
│   ├── 📄 authentication.md      # Authentication guide
│   ├── 📄 error-codes.md         # Error codes reference
│   └── 📄 examples.md            # API usage examples
├── 📁 deployment/                # Deployment guides
│   ├── 📄 docker.md              # Docker deployment guide
│   ├── 📄 heroku.md              # Heroku deployment guide
│   ├── 📄 aws.md                 # AWS deployment guide
│   └── 📄 production.md          # Production setup guide
├── 📁 development/               # Development guides
│   ├── 📄 setup.md               # Development setup
│   ├── 📄 contributing.md        # Contributing guidelines
│   ├── 📄 coding-standards.md    # Coding standards
│   └── 📄 testing.md             # Testing guide
├── 📁 architecture/              # Architecture documentation
│   ├── 📄 README.md              # Architecture overview
│   ├── 📄 frontend.md            # Frontend architecture
│   ├── 📄 backend.md             # Backend architecture
│   ├── 📄 database.md            # Database design
│   └── 📄 security.md            # Security architecture
└── 📄 README.md                  # Documentation index
```

## Scripts Structure (`scripts/`)

```
scripts/
├── 📄 setup.sh                   # Initial project setup
├── 📄 build.sh                   # Build script
├── 📄 deploy.sh                  # Deployment script
├── 📄 test.sh                    # Test runner
├── 📄 lint.sh                    # Linting script
├── 📄 format.sh                  # Code formatting
├── 📄 docker-build.sh            # Docker build script
├── 📄 database-reset.sh          # Database reset script
└── 📄 backup.sh                  # Backup script
```

## Key Features of This Structure

### 1. **Separation of Concerns**
- Clear separation between frontend and backend
- Modular component organization
- Dedicated directories for different types of functionality

### 2. **Scalability**
- Monorepo structure for easy management
- Modular architecture for easy expansion
- Clear boundaries between different parts of the application

### 3. **Maintainability**
- Consistent naming conventions
- Logical file organization
- Comprehensive documentation structure

### 4. **Development Experience**
- Clear import paths
- Easy to navigate structure
- Proper separation of configuration and code

### 5. **Production Ready**
- Docker configuration
- Environment management
- Build and deployment scripts

### 6. **Testing**
- Dedicated test directories
- Clear test organization
- Easy to find and maintain tests

### 7. **Documentation**
- Comprehensive documentation structure
- API documentation
- Architecture documentation
- Development guides

## Best Practices Implemented

1. **Component Organization**: Components are organized by type and functionality
2. **Configuration Management**: Centralized configuration files
3. **Error Handling**: Dedicated error handling middleware
4. **Validation**: Separate validation layers
5. **Security**: Proper authentication and authorization structure
6. **Performance**: Optimized build and deployment configuration
7. **Testing**: Comprehensive test structure
8. **Documentation**: Detailed documentation at every level

This structure follows industry standards and best practices for modern full-stack applications, making it easy to develop, maintain, and scale the Career Solutions application. 