import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Subject, Teacher, Task, Grade, Profile, Settings } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'subjects',
  TEACHERS: 'teachers',
  TASKS: 'tasks',
  GRADES: 'grades',
  PROFILE: 'profile',
  SETTINGS: 'settings',
};

// Default data
const defaultProfile: Profile = {
  name: 'Student',
  bio: 'Welcome to Skedyul!',
  birthday: '',
  profilePicture: '',
};

const defaultSettings: Settings = {
  theme: 'light',
  customThemeColors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
  },
  notifications: {
    enabled: true,
    reminderTime: 15,
  },
};

// Generic storage functions
const storeData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Subjects
export const storeSubjects = async (subjects: Subject[]): Promise<void> => {
  await storeData(STORAGE_KEYS.SUBJECTS, subjects);
};

export const getSubjects = async (): Promise<Subject[]> => {
  const subjects = await getData(STORAGE_KEYS.SUBJECTS);
  return subjects || [];
};

export const addSubject = async (subject: Subject): Promise<void> => {
  const subjects = await getSubjects();
  subjects.push(subject);
  await storeSubjects(subjects);
};

export const updateSubject = async (updatedSubject: Subject): Promise<void> => {
  const subjects = await getSubjects();
  const index = subjects.findIndex(s => s.id === updatedSubject.id);
  if (index !== -1) {
    subjects[index] = updatedSubject;
    await storeSubjects(subjects);
  }
};

export const deleteSubject = async (subjectId: string): Promise<void> => {
  const subjects = await getSubjects();
  const filteredSubjects = subjects.filter(s => s.id !== subjectId);
  await storeSubjects(filteredSubjects);
};

// Teachers
export const storeTeachers = async (teachers: Teacher[]): Promise<void> => {
  await storeData(STORAGE_KEYS.TEACHERS, teachers);
};

export const getTeachers = async (): Promise<Teacher[]> => {
  const teachers = await getData(STORAGE_KEYS.TEACHERS);
  return teachers || [];
};

export const addTeacher = async (teacher: Teacher): Promise<void> => {
  const teachers = await getTeachers();
  teachers.push(teacher);
  await storeTeachers(teachers);
};

export const updateTeacher = async (updatedTeacher: Teacher): Promise<void> => {
  const teachers = await getTeachers();
  const index = teachers.findIndex(t => t.id === updatedTeacher.id);
  if (index !== -1) {
    teachers[index] = updatedTeacher;
    await storeTeachers(teachers);
  }
};

export const deleteTeacher = async (teacherId: string): Promise<void> => {
  const teachers = await getTeachers();
  const filteredTeachers = teachers.filter(t => t.id !== teacherId);
  await storeTeachers(filteredTeachers);
};

// Tasks
export const storeTasks = async (tasks: Task[]): Promise<void> => {
  await storeData(STORAGE_KEYS.TASKS, tasks);
};

export const getTasks = async (): Promise<Task[]> => {
  const tasks = await getData(STORAGE_KEYS.TASKS);
  return tasks || [];
};

export const addTask = async (task: Task): Promise<void> => {
  const tasks = await getTasks();
  tasks.push(task);
  await storeTasks(tasks);
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    await storeTasks(tasks);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter(t => t.id !== taskId);
  await storeTasks(filteredTasks);
};

// Grades
export const storeGrades = async (grades: Grade[]): Promise<void> => {
  await storeData(STORAGE_KEYS.GRADES, grades);
};

export const getGrades = async (): Promise<Grade[]> => {
  const grades = await getData(STORAGE_KEYS.GRADES);
  return grades || [];
};

export const addGrade = async (grade: Grade): Promise<void> => {
  const grades = await getGrades();
  grades.push(grade);
  await storeGrades(grades);
};

export const updateGrade = async (updatedGrade: Grade): Promise<void> => {
  const grades = await getGrades();
  const index = grades.findIndex(g => g.id === updatedGrade.id);
  if (index !== -1) {
    grades[index] = updatedGrade;
    await storeGrades(grades);
  }
};

export const deleteGrade = async (gradeId: string): Promise<void> => {
  const grades = await getGrades();
  const filteredGrades = grades.filter(g => g.id !== gradeId);
  await storeGrades(filteredGrades);
};

// Profile
export const storeProfile = async (profile: Profile): Promise<void> => {
  await storeData(STORAGE_KEYS.PROFILE, profile);
};

export const getProfile = async (): Promise<Profile> => {
  const profile = await getData(STORAGE_KEYS.PROFILE);
  return profile || defaultProfile;
};

export const updateProfile = async (updatedProfile: Profile): Promise<void> => {
  await storeProfile(updatedProfile);
};

// Settings
export const storeSettings = async (settings: Settings): Promise<void> => {
  await storeData(STORAGE_KEYS.SETTINGS, settings);
};

export const getSettings = async (): Promise<Settings> => {
  const settings = await getData(STORAGE_KEYS.SETTINGS);
  return settings || defaultSettings;
};

export const updateSettings = async (updatedSettings: Settings): Promise<void> => {
  await storeSettings(updatedSettings);
};

// Backup and Reset
export const backupData = async (): Promise<AppData> => {
  const subjects = await getSubjects();
  const teachers = await getTeachers();
  const tasks = await getTasks();
  const grades = await getGrades();
  const profile = await getProfile();
  const settings = await getSettings();

  return {
    subjects,
    teachers,
    tasks,
    grades,
    profile,
    settings,
  };
};

export const restoreData = async (data: AppData): Promise<void> => {
  await storeSubjects(data.subjects);
  await storeTeachers(data.teachers);
  await storeTasks(data.tasks);
  await storeGrades(data.grades);
  await storeProfile(data.profile);
  await storeSettings(data.settings);
};

export const resetData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
};
