// Types for HabitGarden App

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
  lastCompletedAt?: Date;
}

export interface Plant {
  id: string;
  habitId: string;
  name: string;
  type: PlantType;
  growthLevel: number; // 0-100
  lastWatered: Date;
}

export type PlantType = 
  | 'succulent'
  | 'fern'
  | 'flower'
  | 'tree'
  | 'cactus'
  | 'bonsai'
  | 'herb'
  | 'vine';

export interface UserStats {
  totalHabits: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  gardenLevel: number;
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  completed: string[]; // habit IDs
  total: number;
}

export type ThemeMode = 'light' | 'dark';
