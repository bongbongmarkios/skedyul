import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Components
import TaskCard from '../components/TaskCard';

// Storage
import { getTasks, getSubjects, getSettings, updateTask } from '../storage';

// Utils
import { searchTasks, getOverdueTasks } from '../utils';

// Types
import { Task, Subject, Settings } from '../types';
import { getTheme } from '../styles/theme';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

const TasksScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, subjectsData, settingsData] = await Promise.all([
        getTasks(),
        getSubjects(),
        getSettings(),
      ]);

      setTasks(tasksData);
      setSubjects(subjectsData);
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

  const getSubjectById = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId);
  };

  const filteredTasks = tasks.filter(task => {
    // Apply search filter
    if (searchQuery) {
      const searchResults = searchTasks([task], searchQuery);
      if (searchResults.length === 0) return false;
    }

    // Apply status filter
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  const overdueTasks = getOverdueTasks(tasks);
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

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
                <Text style={styles.title}>Tasks</Text>
                <Text style={styles.subtitle}>
                  {pendingTasks.length} pending • {completedTasks.length} completed
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask' as never)}
              >
                <MaterialCommunityIcons name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search tasks..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {[
              { key: 'all', label: 'All', count: tasks.length },
              { key: 'pending', label: 'Pending', count: pendingTasks.length },
              { key: 'completed', label: 'Completed', count: completedTasks.length },
              { key: 'overdue', label: 'Overdue', count: overdueTasks.length },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: filter === tab.key ? theme.colors.primary : theme.colors.surface,
                  }
                ]}
                onPress={() => setFilter(tab.key as FilterType)}
              >
                <Text style={[
                  styles.filterText,
                  { color: filter === tab.key ? 'white' : theme.colors.text }
                ]}>
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tasks List */}
          <View style={styles.tasksContainer}>
            {filteredTasks.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={48}
                  color={theme.colors.textTertiary}
                />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  {searchQuery ? 'No tasks found' : 'No tasks yet'}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                  {searchQuery ? 'Try a different search term' : 'Add some tasks to get started'}
                </Text>
              </View>
            ) : (
              filteredTasks
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subject={getSubjectById(task.subjectId)}
                    theme={theme}
                    onPress={() => navigation.navigate('TaskDetail' as never, { 
                      taskId: task.id 
                    } as never)}
                    onToggleComplete={handleToggleTask}
                  />
                ))
            )}
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tasksContainer: {
    marginBottom: 32,
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

export default TasksScreen;
