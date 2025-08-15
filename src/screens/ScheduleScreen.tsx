import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Components
import SubjectCard from '../components/SubjectCard';

// Storage
import { getSubjects, getTeachers, getSettings } from '../storage';

// Utils
import { getTodaySubjects, formatDate, getTodayString } from '../utils';

// Types
import { Subject, Teacher, Settings } from '../types';
import { getTheme } from '../styles/theme';

const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subjectsData, teachersData, settingsData] = await Promise.all([
        getSubjects(),
        getTeachers(),
        getSettings(),
      ]);

      setSubjects(subjectsData);
      setTeachers(teachersData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTeacherById = (teacherId: string) => {
    return teachers.find(teacher => teacher.id === teacherId);
  };

  const todaySubjects = getTodaySubjects(subjects);

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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>Schedule</Text>
                <Text style={styles.subtitle}>
                  {formatDate(getTodayString())}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddSubject' as never)}
              >
                <MaterialCommunityIcons name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Today's Classes
          </Text>
          
          {todaySubjects.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={48}
                color={theme.colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No classes today
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                Add some subjects to get started
              </Text>
            </View>
          ) : (
            todaySubjects
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  teacher={getTeacherById(subject.teacherId)}
                  theme={theme}
                  onPress={() => navigation.navigate('SubjectDetail' as never, { 
                    subjectId: subject.id 
                  } as never)}
                />
              ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ScheduleScreen;

