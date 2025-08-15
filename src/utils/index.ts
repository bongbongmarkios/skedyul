import { Subject, Task, Grade } from '../types';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Date utilities
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDayOfWeek = (date: string): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(date);
  return days[d.getDay()];
};

export const getShortDayOfWeek = (date: string): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date(date);
  return days[d.getDay()];
};

// Get today's subjects
export const getTodaySubjects = (subjects: Subject[]): Subject[] => {
  const today = getDayOfWeek(getTodayString());
  return subjects.filter(subject => subject.daysOfWeek.includes(today));
};

// Get upcoming tasks
export const getUpcomingTasks = (tasks: Task[], limit: number = 5): Task[] => {
  const today = getTodayString();
  return tasks
    .filter(task => !task.completed && task.dueDate >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
};

// Get overdue tasks
export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = getTodayString();
  return tasks.filter(task => !task.completed && task.dueDate < today);
};

// Calculate grade percentage
export const calculateGradePercentage = (score: number, maxScore: number): number => {
  return Math.round((score / maxScore) * 100);
};

// Get grade letter
export const getGradeLetter = (percentage: number): string => {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

// Get grade color
export const getGradeColor = (percentage: number): string => {
  if (percentage >= 90) return '#10b981'; // Green
  if (percentage >= 80) return '#3b82f6'; // Blue
  if (percentage >= 70) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

// Subject color utilities
export const subjectColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6',
  '#a855f7', '#f43f5e', '#fb7185', '#fbbf24', '#fde047',
  '#86efac', '#5eead4', '#67e8f9', '#93c5fd', '#c4b5fd',
];

export const getRandomSubjectColor = (): string => {
  return subjectColors[Math.floor(Math.random() * subjectColors.length)];
};

// Priority utilities
export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#64748b';
  }
};

export const getPriorityLabel = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'None';
  }
};

// Search utilities
export const searchSubjects = (subjects: Subject[], query: string): Subject[] => {
  const lowercaseQuery = query.toLowerCase();
  return subjects.filter(subject =>
    subject.name.toLowerCase().includes(lowercaseQuery) ||
    subject.room.toLowerCase().includes(lowercaseQuery) ||
    subject.notes.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Validation utilities
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date) && !isNaN(Date.parse(date));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
