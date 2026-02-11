# Sneply - Next-Generation Creator Interaction Platform

A unique social media platform that combines short-form and long-form content with AI-powered recommendations and creator-focused features.

## 🚀 Core Features

### Dual Mode Content System
- **Spark Mode**: 30-60 second vertical videos for quick, impactful content
- **Deep Mode**: 5-20 minute meaningful videos for in-depth exploration

### Creator Energy Score
- Dynamic energy levels based on engagement and content quality
- Visual neon progress rings around profiles
- Creator ranks: Rising → Pro → Legend

### AI-Powered Feed
- Smart content mixing Spark + Deep videos
- Mood-based filtering (Focus / Fun / Learn / Chill)
- Intelligent time control suggestions
- No random scrolling addiction

### Mood-Based UI
- User selects current mood for personalized experience
- Feed adapts based on mood preferences
- Content recommendations aligned with mood

### Real Creator Rooms
- Live chat rooms per creator
- Structured fan communities
- Not basic DMs - organized discussions
- Real-time interaction features

### Achievement Badges
- Creator ranks with animated badges
- Progress tracking and gamification
- Multiple rarity levels (Common → Rare → Epic → Legendary)

### Premium Neon Glass UI
- Dark futuristic theme with soft glow elements
- Glassmorphism design patterns
- Consistent neon color scheme
- Modern, clean aesthetic

## 🛠 Tech Stack

- **Framework**: React Native (Expo)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Video**: Expo AV
- **Navigation**: React Navigation
- **State**: AsyncStorage & Context API
- **Icons**: React Native SVG

## 📱 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── features/         # Feature-specific components
│       ├── AchievementBadges.tsx
│       ├── CreatorEnergyScore.tsx
│       ├── MoodSelection.tsx
│       ├── TimeControl.tsx
│       └── NeonBackground.tsx
├── context/
│   ├── AuthContext.tsx    # Authentication state
│   └── AppContext.tsx     # Global app state
├── navigation/
│   ├── RootNavigator.tsx  # Main navigation logic
│   └── TabNavigator.tsx   # Bottom tab navigation
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── HomeScreen.tsx      # AI-powered feed
│   ├── ShortsScreen.tsx    # Spark mode
│   ├── DeepModeScreen.tsx  # Deep mode
│   ├── UploadScreen.tsx   # Video upload
│   ├── ChatScreen.tsx      # Creator rooms
│   └── ProfileScreen.tsx   # User profile & achievements
├── services/
│   ├── firebase.ts         # Firebase configuration
│   ├── authService.ts      # Authentication logic
│   └── videoService.ts     # Video operations
├── types/
│   └── index.ts           # TypeScript definitions
├── utils/
├── hooks/
├── constants/
│   └── index.ts          # App constants and config
└── theme/
    └── colors.ts
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "sneply"
3. Enable Authentication, Firestore, and Storage
4. Download the configuration file

#### Configure Firebase
1. Copy your Firebase config from the console
2. Update `src/services/firebase.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "sneply.firebaseapp.com",
  projectId: "sneply",
  storageBucket: "sneply.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Environment Setup

#### Required Permissions
The app requires these permissions (configured in `app.json`):
- Camera access for video recording
- Microphone access for audio
- Storage access for video files
- Network access for Firebase

#### Android Configuration
- Target SDK: 34
- Min SDK: 21
- Package: `com.sneply.app`
- Permissions automatically configured

#### iOS Configuration
- Bundle Identifier: `com.sneply.app`
- Camera, Microphone, and Photo Library permissions
- Portrait orientation only
- Light status bar style

## 🚀 Running the App

### Development
```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Production Build
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build for Web
expo build:web
```

## 📱 Platform-Specific Features

### Android
- Adaptive icons with dark theme
- Edge-to-edge display
- Hardware camera and microphone support
- External storage access for videos

### iOS
- Tablet support enabled
- Native camera integration
- Photo library access
- Optimized for iPhone and iPad

### Web
- Responsive design
- Metro bundler
- PWA capabilities
- Favicon and metadata

## 🔐 Security Considerations

### Authentication
- Firebase Auth integration with proper error handling
- Secure token management
- Session persistence
- Password validation

### Data Storage
- Firebase Security Rules configured
- User data encryption
- Secure file uploads
- Privacy controls

### Permissions
- Minimal required permissions
- User consent flows
- Privacy policy compliance
- Data transparency

## 🎯 Key Features Implementation

### AI-Powered Feed
```typescript
// Content filtering based on mood and time
const filteredContent = mixedContent.filter(item => {
  const moodMatch = item.mood === currentMood;
  const timeScore = timeControl.currentUsage / timeControl.dailyLimit;
  const shouldShowLongContent = timeScore < 0.7;
  
  if (item.mode === 'deep' && !shouldShowLongContent) {
    return false;
  }
  
  return moodMatch;
});
```

### Creator Energy System
```typescript
// Dynamic energy calculation
const calculateEnergy = (engagement, contentQuality, consistency) => {
  const baseEnergy = engagement * 0.1;
  const qualityBonus = contentQuality * 0.3;
  const consistencyBonus = consistency * 0.2;
  
  return Math.min(100, baseEnergy + qualityBonus + consistencyBonus);
};
```

### Time Control
```typescript
// Intelligent break suggestions
const getSuggestions = (usagePercentage, currentMood) => {
  if (usagePercentage >= 90) return 'Consider taking a break';
  if (usagePercentage >= 75) return 'Switch to Spark mode';
  if (usagePercentage >= 50) return 'Try a different mood';
  return 'You\'re doing great!';
};
```

## 🐛 Troubleshooting

### Common Issues

#### Firebase Connection
```bash
# Check Firebase configuration
# Verify network connectivity
# Validate API keys
```

#### Build Errors
```bash
# Clear cache
expo start --clear

# Reset node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Permission Issues
```bash
# Check app.json permissions
# Verify device permissions
# Test camera and microphone access
```

## 📊 Analytics & Monitoring

### Performance Metrics
- App startup time
- Screen load performance
- Memory usage tracking
- Network request monitoring

### Error Tracking
- Comprehensive error boundaries
- Firebase error logging
- User feedback collection
- Crash reporting

## 🚀 Deployment

### App Store Submission
- Follow platform guidelines
- Prepare app store assets
- Test on real devices
- Privacy policy compliance

### Continuous Integration
- GitHub Actions setup
- Automated testing pipeline
- Code quality checks
- Automated builds

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**Sneply** - Where creators connect with their audience through intelligent, mood-based content experiences.
