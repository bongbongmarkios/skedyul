import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';

// Storage
import { getSubjects, getTasks, getSettings } from '../storage';

// Types
import { Subject, Task, Settings } from '../types';
import { getTheme } from '../styles/theme';

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subjectsData, tasksData, settingsData] = await Promise.all([
        getSubjects(),
        getTasks(),
        getSettings(),
      ]);

      setSubjects(subjectsData);
      setTasks(tasksData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    
    // Mark task due dates
    tasks.forEach(task => {
      const color = task.completed ? theme.colors.success : theme.colors.warning;
      marked[task.dueDate] = {
        marked: true,
        dotColor: color,
      };
    });

    return marked;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Calendar
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.textTertiary,
          dotColor: theme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text,
          indicatorColor: theme.colors.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        markedDates={getMarkedDates()}
        markingType={'dot'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalendarScreen;
