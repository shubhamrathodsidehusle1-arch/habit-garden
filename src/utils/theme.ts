import { ThemeMode } from '../types';

export interface Theme {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  card: string;
}

export const lightTheme: Theme = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F2F5',
  primary: '#4CAF50',
  primaryLight: '#81C784',
  text: '#1A1A2E',
  textSecondary: '#4A4A68',
  textMuted: '#8E8E9A',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  border: '#E0E0E0',
  card: '#FFFFFF',
};

export const darkTheme: Theme = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceSecondary: '#21262D',
  primary: '#4CAF50',
  primaryLight: '#81C784',
  text: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  success: '#3FB950',
  warning: '#D29922',
  error: '#F85149',
  border: '#30363D',
  card: '#161B22',
};

export const getTheme = (mode: ThemeMode): Theme => (mode === 'dark' ? darkTheme : lightTheme);

export const habitColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#795548', // Brown
];

export const habitIcons = [
  '💪', '📚', '🏃', '🧘', '💧', '🌱', '🎯', '⭐',
  '💤', '🍎', '✍️', '🎨', '🎵', '💻', '🧹', '❤️',
];
