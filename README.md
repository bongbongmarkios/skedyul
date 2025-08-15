# Skedyul - Advanced School Planner

A modern, offline-first React Native school planner app built with Expo. Skedyul helps students stay organized with their classes, tasks, grades, and academic responsibilities.

## Features

### 🎯 Core Features
- **Offline-First Design**: Works 100% offline with local storage
- **Modern UI/UX**: Futuristic design with smooth animations
- **Cross-Platform**: Works on both iOS and Android
- **Theme Support**: Light, dark, and custom themes

### 📚 Academic Management
- **Subject Management**: Create and manage subjects with detailed information
- **Schedule Viewing**: Daily and weekly schedule views
- **Task Tracking**: Create tasks linked to subjects with priority levels
- **Grade Tracking**: Log and track grades for each subject
- **Teacher Management**: Store teacher information and contact details

### 🎨 User Experience
- **Dashboard**: Overview of today's schedule and upcoming tasks
- **Calendar Integration**: Visual calendar with task and class markers
- **Search & Filter**: Advanced search and filtering capabilities
- **Smooth Animations**: React Native Reanimated for fluid interactions

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (bottom-tabs + stack)
- **Storage**: AsyncStorage for offline data persistence
- **UI Components**: Custom components with React Native Paper styling
- **Animations**: React Native Reanimated
- **Calendar**: react-native-calendars
- **Icons**: MaterialCommunityIcons
- **Language**: TypeScript

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SubjectCard.tsx
│   └── TaskCard.tsx
├── navigation/          # Navigation configuration
│   └── index.tsx
├── screens/            # App screens
│   ├── DashboardScreen.tsx
│   ├── ScheduleScreen.tsx
│   ├── TasksScreen.tsx
│   ├── CalendarScreen.tsx
│   ├── MenuScreen.tsx
│   └── ... (other screens)
├── storage/            # Data persistence layer
│   └── index.ts
├── styles/             # Theme and styling
│   └── theme.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── index.ts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Skedyul
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## App Navigation

### Bottom Tab Navigation
- **Dashboard**: Overview of today's schedule and quick actions
- **Schedule**: View and manage class schedules
- **Tasks**: Create and track academic tasks
- **Calendar**: Monthly calendar view with events
- **Menu**: Access to settings and additional features

### Menu Options
- **Profile**: Manage personal information
- **Teachers**: Add and manage teacher information
- **Theme**: Customize app appearance
- **About**: App information and version
- **Settings**: App preferences and data management

## Data Models

### Subject
- Name, color, room, teacher, term
- Days of the week, start/end times
- Notes and additional information

### Task
- Title, description, subject association
- Due date, priority level, completion status

### Teacher
- Name, subject specialization, contact information

### Grade
- Subject association, title, score, max score, date

### Profile
- Name, bio, birthday, profile picture

### Settings
- Theme preferences, notification settings

## Features in Detail

### Dashboard
- Today's class schedule
- Quick action buttons
- Upcoming tasks overview
- Overdue tasks alert

### Schedule Management
- Daily view of classes
- Subject details with teacher information
- Time-based sorting
- Room and location tracking

### Task Management
- Create tasks linked to subjects
- Priority levels (Low, Medium, High)
- Due date tracking
- Completion status
- Search and filtering

### Calendar Integration
- Monthly calendar view
- Task due date markers
- Class schedule indicators
- Visual event representation

### Theme System
- Light mode
- Dark mode
- Custom color themes
- Dynamic theme switching

## Offline Capabilities

The app is designed to work completely offline:
- All data stored locally using AsyncStorage
- No internet connection required
- Data persists between app sessions
- Backup and restore functionality

## Development

### Adding New Features
1. Create new screen in `src/screens/`
2. Add navigation route in `src/navigation/index.tsx`
3. Update types in `src/types/index.ts` if needed
4. Add storage functions in `src/storage/index.ts`

### Styling
- Use the theme system in `src/styles/theme.ts`
- Follow the existing component patterns
- Use the provided color palette and spacing

### Data Management
- All data operations go through the storage layer
- Use TypeScript interfaces for type safety
- Implement proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Skedyul** - Empowering students to stay organized and succeed academically! 📚✨
