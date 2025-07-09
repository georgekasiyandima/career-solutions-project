# Career Solutions Mobile App

A React Native mobile application for the Career Solutions platform, providing job search, career guidance, and professional development features.

## Features

### 🔐 Authentication
- User registration and login
- Password reset functionality
- Secure token-based authentication
- Biometric authentication support

### 💼 Job Management
- Browse available job opportunities
- Advanced job search with filters
- Save and track favorite jobs
- Apply for jobs directly from the app
- Job recommendations based on profile

### 📅 Booking System
- Schedule career counseling sessions
- Book interview preparation sessions
- View and manage appointments
- Real-time booking confirmations

### 📞 Enquiry System
- Submit career-related questions
- Track enquiry status
- Receive expert responses
- FAQ and help resources

### 📱 Notifications
- Push notifications for job updates
- Booking reminders
- Application status updates
- Personalized career tips

### 🎨 User Experience
- Dark/Light theme support
- Offline functionality
- Real-time updates
- Smooth animations and transitions
- Responsive design for all screen sizes

### 🔍 Advanced Features
- Global search across all content
- Voice search capabilities
- QR code scanning for quick access
- File upload and document management
- Social media integration

## Tech Stack

- **Framework**: React Native 0.72.6
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage, Keychain
- **Animations**: React Native Reanimated, Lottie
- **Charts**: React Native Chart Kit
- **Maps**: React Native Maps
- **Push Notifications**: React Native Push Notification
- **Biometrics**: React Native Biometrics

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (buttons, modals, etc.)
│   └── features/       # Feature-specific components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── main/          # Main app screens
│   └── common/        # Common screens (loading, error, etc.)
├── navigation/         # Navigation configuration
├── services/          # API services and external integrations
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── utils/             # Utility functions and helpers
├── constants/         # App constants and configuration
├── types/             # TypeScript type definitions
└── assets/            # Images, fonts, and other static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- CocoaPods (for iOS dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareerSolutionsMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the API base URL and other configuration

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Start Metro Bundler
```bash
npm start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:5000/api
WS_BASE_URL=ws://localhost:5000
ENVIRONMENT=development
```

### API Configuration

The app connects to the Career Solutions backend API. Ensure the backend server is running on the configured port.

## Development

### Code Style

- Use TypeScript for all new code
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

### Building

#### Android Release
```bash
npm run build:android
```

#### iOS Release
```bash
npm run build:ios
```

## Features in Detail

### Authentication Flow

1. **Login Screen**: Email/password authentication
2. **Registration**: New user account creation
3. **Password Reset**: Email-based password recovery
4. **Biometric Auth**: Fingerprint/Face ID support

### Job Search

1. **Job Listings**: Browse available positions
2. **Advanced Filters**: Location, salary, experience level
3. **Search**: Global search with suggestions
4. **Job Details**: Comprehensive job information
5. **Application**: One-tap job application

### Booking System

1. **Session Booking**: Schedule career counseling
2. **Calendar Integration**: View and manage appointments
3. **Reminders**: Push notifications for upcoming sessions
4. **Rescheduling**: Modify existing bookings

### Notifications

1. **Push Notifications**: Real-time updates
2. **In-App Notifications**: Notification center
3. **Email Notifications**: Important updates via email
4. **Customization**: User preference settings

## Security Features

- JWT token authentication
- Secure storage for sensitive data
- Biometric authentication
- Network security (HTTPS/WSS)
- Input validation and sanitization
- Rate limiting protection

## Performance Optimizations

- Image optimization and caching
- Lazy loading for large lists
- Memory management
- Bundle size optimization
- Offline functionality
- Background task handling

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

### Debug Mode

Enable debug mode for development:

```bash
# Android
adb reverse tcp:8081 tcp:8081

# iOS
# Use React Native Debugger or Chrome DevTools
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@careersolutions.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Job browsing and search
- ✅ Booking system
- ✅ Notifications

### Phase 2 (Next)
- 🔄 Advanced job matching
- 🔄 Video calling integration
- 🔄 Resume builder
- 🔄 Interview simulator

### Phase 3 (Future)
- 📋 AI-powered career recommendations
- 📋 Skills assessment tools
- 📋 Networking features
- 📋 Mentorship platform 