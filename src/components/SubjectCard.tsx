import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { Subject, Teacher } from '../types';
import { formatTime } from '../utils';
import { Theme } from '../styles/theme';

interface SubjectCardProps {
  subject: Subject;
  teacher?: Teacher;
  theme: Theme;
  onPress?: () => void;
  showTime?: boolean;
  compact?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  teacher,
  theme,
  onPress,
  showTime = true,
  compact = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
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

  const CardContent = () => (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={[subject.color, `${subject.color}80`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.colorBar, { backgroundColor: subject.color }]}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.subjectName, { color: theme.colors.text }]}>
            {subject.name}
          </Text>
          {showTime && (
            <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
              {formatTime(subject.startTime)} - {formatTime(subject.endTime)}
            </Text>
          )}
        </View>

        {!compact && (
          <View style={styles.details}>
            {teacher && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons 
                  name="account" 
                  size={16} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                  {teacher.name}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={16} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {subject.room}
              </Text>
            </View>

            {subject.notes && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons 
                  name="note-text" 
                  size={16} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                  {subject.notes}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={[styles.termBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
              {subject.term} Term
            </Text>
          </View>
          
          <View style={styles.daysContainer}>
            {subject.daysOfWeek.map((day, index) => (
              <View 
                key={index} 
                style={[
                  styles.dayBadge, 
                  { backgroundColor: subject.color + '20' }
                ]}
              >
                <Text style={[styles.dayText, { color: subject.color }]}>
                  {day.slice(0, 3)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
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
  colorBar: {
    width: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  termText: {
    fontSize: 12,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default SubjectCard;
