import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Task, Subject } from '../types';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils';
import { Theme } from '../styles/theme';

interface TaskCardProps {
  task: Task;
  subject?: Subject;
  theme: Theme;
  onPress?: () => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  subject,
  theme,
  onPress,
  onToggleComplete,
  compact = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const checkScale = useSharedValue(task.completed ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    translateY.value = withSpring(2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
  };

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      const newCompleted = !task.completed;
      
      if (newCompleted) {
        checkScale.value = withSpring(1);
      } else {
        checkScale.value = withTiming(0);
      }
      
      onToggleComplete(task.id, newCompleted);
    }
  };

  const priorityColor = getPriorityColor(task.priority);
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const CardContent = () => (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface,
        opacity: task.completed ? 0.6 : 1,
      }
    ]}>
      <LinearGradient
        colors={[priorityColor, `${priorityColor}80`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.priorityBar, { backgroundColor: priorityColor }]}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title, 
              { 
                color: theme.colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              }
            ]}>
              {task.title}
            </Text>
            
            {!compact && (
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            )}
          </View>
          
          {!compact && task.description && (
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {task.description}
            </Text>
          )}
        </View>

        {!compact && (
          <View style={styles.details}>
            {subject && (
              <View style={styles.detailRow}>
                <View style={[styles.subjectIndicator, { backgroundColor: subject.color }]} />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                  {subject.name}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="calendar" 
                size={16} 
                color={isOverdue ? theme.colors.error : theme.colors.textSecondary} 
              />
              <Text style={[
                styles.detailText, 
                { 
                  color: isOverdue ? theme.colors.error : theme.colors.textSecondary,
                  fontWeight: isOverdue ? '600' : 'normal',
                }
              ]}>
                {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </Text>
            </View>
          </View>
        )}

        {compact && (
          <View style={styles.compactFooter}>
            <Text style={[styles.dueDate, { color: theme.colors.textSecondary }]}>
              {formatDate(task.dueDate)}
            </Text>
            {subject && (
              <View style={[styles.subjectBadge, { backgroundColor: subject.color + '20' }]}>
                <Text style={[styles.subjectText, { color: subject.color }]}>
                  {subject.name}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleToggleComplete}
        style={styles.checkboxContainer}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox, 
          { 
            borderColor: task.completed ? priorityColor : theme.colors.border,
            backgroundColor: task.completed ? priorityColor : 'transparent',
          }
        ]}>
          <Animated.View style={checkAnimatedStyle}>
            <MaterialCommunityIcons 
              name="check" 
              size={16} 
              color="white" 
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={[styles.touchable, theme.shadows.md]}
      >
        <Animated.View style={animatedStyle}>
          <CardContent />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.touchable, theme.shadows.md]}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  priorityBar: {
    width: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  subjectBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '600',
  },
  checkboxContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskCard;
