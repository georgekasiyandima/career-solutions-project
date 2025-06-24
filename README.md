# Getty Jobboard Website

A full-stack web application for job posting and career solutions, built with React (frontend) and Node.js/Express (backend).

## 🚀 Features

- **Job Posting & Management**: Create, edit, and manage job listings
- **User Authentication**: Secure user registration and login system
- **Booking System**: Schedule appointments and consultations
- **Enquiry Management**: Handle customer inquiries efficiently
- **Success Stories**: Showcase successful career transitions
- **Feed System**: Social media-like feed for updates and announcements
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Tracking**: Event tracking and analytics

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** - Modern React with hooks and functional components
- **Material-UI** - Component library for consistent design
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Knex.js** - SQL query builder
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email functionality

## 📁 Project Structure

```
Getty Jobboard Website/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/               # Backend Node.js application
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── migrations/       # Database migrations
│   ├── seeds/           # Database seeders
│   ├── utils/           # Utility functions
│   ├── package.json
│   └── ...
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

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

4. **Set up the database**
   ```bash
   cd ../backend
   npm run migrate
   npm run seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📊 Database Schema

The application uses SQLite with the following main tables:
- `users` - User accounts and authentication
- `jobs` - Job postings and listings
- `bookings` - Appointment scheduling
- `enquiries` - Customer inquiries
- `feed_posts` - Social feed content
- `success_stories` - Success case studies
- `tracking_events` - Analytics and tracking

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start          # Start the server
npm run dev        # Start in development mode with nodemon
npm run migrate    # Run database migrations
npm run seed       # Seed the database with initial data
npm test           # Run tests
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🌟 Key Components

### Optimized Components
- **DidYouKnow**: Interactive fact carousel with pre-loading and Suspense
- **JobDetails**: Detailed job information display
- **BookingForm**: Appointment scheduling with validation
- **EnquiryForm**: Customer inquiry submission
- **Feed**: Social media-style feed with real-time updates

### Performance Optimizations
- **Data Colocation**: Data kept close to components
- **Image Pre-loading**: Optimized image loading strategies
- **Code Splitting**: Lazy loading for better performance
- **Memoization**: React.memo and useMemo for optimization
- **Suspense**: Modern React data fetching patterns

## 🔐 Environment Variables

Create `.env` files in both `client` and `backend` directories:

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up environment variables
2. Run database migrations
3. Start the production server

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**George Kasiyandima**
- GitHub: [@georgekasiyandima](https://github.com/georgekasiyandima)

## 🙏 Acknowledgments

- React team for the amazing framework
- Material-UI for the component library
- Express.js community for the robust backend framework
- All contributors and supporters

---

For more information, check out the [OPTIMIZATION_GUIDE.md](client/OPTIMIZATION_GUIDE.md) for detailed performance optimization strategies. 