import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TasksScreen from '../screens/TasksScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeachersScreen from '../screens/TeachersScreen';
import ThemeScreen from '../screens/ThemeScreen';
import AboutScreen from '../screens/AboutScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddSubjectScreen from '../screens/AddSubjectScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import AddTeacherScreen from '../screens/AddTeacherScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TeacherDetailScreen from '../screens/TeacherDetailScreen';
import GradesScreen from '../screens/GradesScreen';
import AddGradeScreen from '../screens/AddGradeScreen';

// Types
import { Theme } from '../styles/theme';
import { getTheme } from '../styles/theme';
import { getSettings } from '../storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Menu Stack Navigator
const MenuStack = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="MenuMain" 
        component={MenuScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Teachers" 
        component={TeachersScreen}
        options={{ title: 'Teachers' }}
      />
      <Stack.Screen 
        name="AddTeacher" 
        component={AddTeacherScreen}
        options={{ title: 'Add Teacher' }}
      />
      <Stack.Screen 
        name="TeacherDetail" 
        component={TeacherDetailScreen}
        options={{ title: 'Teacher Details' }}
      />
      <Stack.Screen 
        name="Theme" 
        component={ThemeScreen}
        options={{ title: 'Theme' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

// Schedule Stack Navigator
const ScheduleStack = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="ScheduleMain" 
        component={ScheduleScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddSubject" 
        component={AddSubjectScreen}
        options={{ title: 'Add Subject' }}
      />
      <Stack.Screen 
        name="SubjectDetail" 
        component={SubjectDetailScreen}
        options={{ title: 'Subject Details' }}
      />
      <Stack.Screen 
        name="Grades" 
        component={GradesScreen}
        options={{ title: 'Grades' }}
      />
      <Stack.Screen 
        name="AddGrade" 
        component={AddGradeScreen}
        options={{ title: 'Add Grade' }}
      />
    </Stack.Navigator>
  );
};

// Tasks Stack Navigator
const TasksStack = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="TasksMain" 
        component={TasksScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen}
        options={{ title: 'Add Task' }}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen}
        options={{ title: 'Task Details' }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar-clock' : 'calendar-clock-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'checkbox-marked-outline' : 'checkbox-blank-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'menu' : 'menu';
          } else {
            iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Tasks" component={TasksStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Menu" component={MenuStack} />
    </Tab.Navigator>
  );
};

// Main Navigation Container
const Navigation = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
