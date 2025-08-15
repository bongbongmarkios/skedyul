import { Settings } from '../types';

export const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceVariant: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    border: '#e2e8f0',
    borderVariant: '#cbd5e1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
  },
  shadows: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    border: '#334155',
    borderVariant: '#475569',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  shadows: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const getCustomTheme = (settings: Settings) => ({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: settings.customThemeColors.primary,
    secondary: settings.customThemeColors.secondary,
    background: settings.customThemeColors.background,
    surface: settings.customThemeColors.surface,
  },
});

export const getTheme = (settings: Settings) => {
  switch (settings.theme) {
    case 'dark':
      return darkTheme;
    case 'custom':
      return getCustomTheme(settings);
    default:
      return lightTheme;
  }
};

export type Theme = typeof lightTheme;
