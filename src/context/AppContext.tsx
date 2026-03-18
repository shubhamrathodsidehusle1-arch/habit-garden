import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, Plant, UserStats, ThemeMode, DayProgress } from '../types';

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get today's date as string
const getToday = () => new Date().toISOString().split('T')[0];

// Initial stats
const initialStats: UserStats = {
  totalHabits: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalCompletions: 0,
  gardenLevel: 1,
};

interface AppState {
  habits: Habit[];
  plants: Plant[];
  stats: UserStats;
  theme: ThemeMode;
  todayProgress: DayProgress;
}

type AppAction =
  | { type: 'ADD_HABIT'; payload: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'createdAt'> }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'COMPLETE_HABIT'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_TODAY' };

const getPlantType = (icon: string): Plant['type'] => {
  const mapping: Record<string, Plant['type']> = {
    '💪': 'succulent',
    '📚': 'fern',
    '🏃': 'flower',
    '🧘': 'bonsai',
    '💧': 'cactus',
    '🌱': 'herb',
    '🎯': 'vine',
    '⭐': 'tree',
  };
  return mapping[icon] || 'succulent';
};

const initialState: AppState = {
  habits: [],
  plants: [],
  stats: initialStats,
  theme: 'light',
  todayProgress: {
    date: getToday(),
    completed: [],
    total: 0,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_HABIT': {
      const newHabit: Habit = {
        id: generateId(),
        ...action.payload,
        streak: 0,
        completedToday: false,
        createdAt: new Date(),
      };

      // Create a plant for the new habit
      const newPlant: Plant = {
        id: generateId(),
        habitId: newHabit.id,
        name: newHabit.name,
        type: getPlantType(newHabit.icon),
        growthLevel: 10,
        lastWatered: new Date(),
      };

      return {
        ...state,
        habits: [...state.habits, newHabit],
        plants: [...state.plants, newPlant],
        stats: {
          ...state.stats,
          totalHabits: state.stats.totalHabits + 1,
        },
        todayProgress: {
          ...state.todayProgress,
          total: state.todayProgress.total + 1,
        },
      };
    }

    case 'DELETE_HABIT': {
      const habit = state.habits.find(h => h.id === action.payload);
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
        plants: state.plants.filter(p => p.habitId !== action.payload),
        stats: {
          ...state.stats,
          totalHabits: Math.max(0, state.stats.totalHabits - 1),
        },
        todayProgress: {
          ...state.todayProgress,
          total: Math.max(0, state.todayProgress.total - 1),
          completed: state.todayProgress.completed.filter(id => id !== action.payload),
        },
      };
    }

    case 'COMPLETE_HABIT': {
      const habit = state.habits.find(h => h.id === action.payload);
      if (!habit || habit.completedToday) return state;

      const newStreak = habit.streak + 1;
      const isLongest = newStreak > state.stats.longestStreak;

      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload
            ? { ...h, completedToday: true, streak: newStreak, lastCompletedAt: new Date() }
            : h
        ),
        plants: state.plants.map(p =>
          p.habitId === action.payload
            ? { ...p, growthLevel: Math.min(100, p.growthLevel + 10), lastWatered: new Date() }
            : p
        ),
        stats: {
          ...state.stats,
          currentStreak: state.todayProgress.completed.length === 0 ? 1 : state.stats.currentStreak,
          longestStreak: isLongest ? newStreak : state.stats.longestStreak,
          totalCompletions: state.stats.totalCompletions + 1,
        },
        todayProgress: {
          ...state.todayProgress,
          completed: [...state.todayProgress.completed, action.payload],
        },
      };
    }

    case 'TOGGLE_THEME': {
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    }

    case 'RESET_TODAY': {
      return {
        ...state,
        habits: state.habits.map(h => ({ ...h, completedToday: false })),
        todayProgress: {
          date: getToday(),
          completed: [],
          total: state.habits.length,
        },
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addHabit: (name: string, icon: string, color: string) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@habitgarden_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state to storage on change
  useEffect(() => {
    if (state.habits.length > 0 || state.plants.length > 0) {
      saveState();
    }
  }, [state]);

  // Reset today if date changed
  useEffect(() => {
    const today = getToday();
    if (state.todayProgress.date !== today) {
      dispatch({ type: 'RESET_TODAY' });
    }
  }, []);

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if we need to reset for a new day
        const today = getToday();
        if (parsed.todayProgress?.date !== today) {
          parsed.todayProgress = {
            date: today,
            completed: [],
            total: parsed.habits?.length || 0,
          };
          parsed.habits = (parsed.habits || []).map((h: any) => ({ ...h, completedToday: false }));
        }
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  };

  const addHabit = (name: string, icon: string, color: string) => {
    dispatch({ type: 'ADD_HABIT', payload: { name, icon, color } });
  };

  const deleteHabit = (id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  };

  const completeHabit = (id: string) => {
    dispatch({ type: 'COMPLETE_HABIT', payload: id });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addHabit, deleteHabit, completeHabit, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
