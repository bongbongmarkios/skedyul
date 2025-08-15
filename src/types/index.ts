export interface Subject {
  id: string;
  name: string;
  color: string;
  room: string;
  teacherId: string;
  term: '1st' | '2nd';
  notes: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  createdAt: number;
}

export interface Teacher {
  id: string;
  name: string;
  subjectSpecialization: string;
  contactInfo: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: number;
}

export interface Grade {
  id: string;
  subjectId: string;
  title: string;
  score: number;
  maxScore: number;
  date: string;
  createdAt: number;
}

export interface Profile {
  name: string;
  bio: string;
  birthday: string;
  profilePicture: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'custom';
  customThemeColors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  notifications: {
    enabled: boolean;
    reminderTime: number;
  };
}

export interface AppData {
  subjects: Subject[];
  teachers: Teacher[];
  tasks: Task[];
  grades: Grade[];
  profile: Profile;
  settings: Settings;
}
