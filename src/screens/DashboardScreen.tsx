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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Components
import SubjectCard from '../components/SubjectCard';
import TaskCard from '../components/TaskCard';

// Storage
import {
  getSubjects,
  getTasks,
  getTeachers,
  getProfile,
  getSettings,
  updateTask,
} from '../storage';

// Utils
import {
  getTodaySubjects,
  getUpcomingTasks,
  getOverdueTasks,
  formatDate,
  getTodayString,
} from '../utils';

// Types
import { Subject, Task, Teacher, Profile, Settings } from '../types';
import { getTheme } from '../styles/theme';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values
  const headerScale = useSharedValue(0.8);
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  useEffect(() => {
    loadData();
    animateIn();
  }, []);

  const animateIn = () => {
    headerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    headerOpacity.value = withTiming(1, { duration: 600 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    contentOpacity.value = withTiming(1, { duration: 800 });
  };

  const loadData = async () => {
    try {
      const [subjectsData, tasksData, teachersData, profileData, settingsData] = await Promise.all([
        getSubjects(),
        getTasks(),
        getTeachers(),
        getProfile(),
        getSettings(),
      ]);

      setSubjects(subjectsData);
      setTasks(tasksData);
      setTeachers(teachersData);
      setProfile(profileData);
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

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
    await updateTask(updatedTasks.find(t => t.id === taskId)!);
  };

  const todaySubjects = getTodaySubjects(subjects);
  const upcomingTasks = getUpcomingTasks(tasks, 3);
  const overdueTasks = getOverdueTasks(tasks);

  const getTeacherById = (teacherId: string) => {
    return teachers.find(teacher => teacher.id === teacherId);
  };

  const getSubjectById = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

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
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good morning!</Text>
                <Text style={styles.name}>{profile?.name || 'Student'}</Text>
                <Text style={styles.date}>{formatDate(getTodayString())}</Text>
              </View>
              <View style={styles.headerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{todaySubjects.length}</Text>
                  <Text style={styles.statLabel}>Classes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{upcomingTasks.length}</Text>
                  <Text style={styles.statLabel}>Tasks</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('Schedule' as never, { screen: 'AddSubject' } as never)}
              >
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.text }]}>
                  Add Subject
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('Tasks' as never, { screen: 'AddTask' } as never)}
              >
                <MaterialCommunityIcons
                  name="checkbox-plus"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.text }]}>
                  Add Task
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('Menu' as never, { screen: 'Teachers' } as never)}
              >
                <MaterialCommunityIcons
                  name="account-plus"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.text }]}>
                  Add Teacher
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Schedule */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Today's Schedule
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Schedule' as never)}>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

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
              todaySubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  teacher={getTeacherById(subject.teacherId)}
                  theme={theme}
                  onPress={() => navigation.navigate('Schedule' as never, { 
                    screen: 'SubjectDetail', 
                    params: { subjectId: subject.id } 
                  } as never)}
                  compact
                />
              ))
            )}
          </View>

          {/* Upcoming Tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Upcoming Tasks
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks' as never)}>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {upcomingTasks.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={48}
                  color={theme.colors.textTertiary}
                />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No upcoming tasks
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                  Add some tasks to stay organized
                </Text>
              </View>
            ) : (
              upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={getSubjectById(task.subjectId)}
                  theme={theme}
                  onPress={() => navigation.navigate('Tasks' as never, { 
                    screen: 'TaskDetail', 
                    params: { taskId: task.id } 
                  } as never)}
                  onToggleComplete={handleToggleTask}
                  compact
                />
              ))
            )}
          </View>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
                Overdue Tasks ({overdueTasks.length})
              </Text>
              {overdueTasks.slice(0, 2).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={getSubjectById(task.subjectId)}
                  theme={theme}
                  onPress={() => navigation.navigate('Tasks' as never, { 
                    screen: 'TaskDetail', 
                    params: { taskId: task.id } 
                  } as never)}
                  onToggleComplete={handleToggleTask}
                  compact
                />
              ))}
            </View>
          )}
        </Animated.View>
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
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
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

export default DashboardScreen;
