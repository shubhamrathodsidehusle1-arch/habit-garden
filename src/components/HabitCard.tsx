import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme } from '../utils/theme';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { state, completeHabit, deleteHabit } = useApp();
  const theme = getTheme(state.theme);

  const handleComplete = () => {
    if (!habit.completedToday) {
      completeHabit(habit.id);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This will also remove its plant from your garden.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
          <View style={styles.streakContainer}>
            <Text style={[styles.streak, { color: habit.streak > 0 ? theme.primary : theme.textMuted }]}>
              🔥 {habit.streak} day streak
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkButton,
          { 
            backgroundColor: habit.completedToday ? theme.primary : theme.surfaceSecondary,
            borderColor: habit.completedToday ? theme.primary : theme.border,
          },
        ]}
        onPress={handleComplete}
        onLongPress={handleDelete}
      >
        <Text style={styles.checkText}>{habit.completedToday ? '✓' : '○'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streak: {
    fontSize: 13,
    fontWeight: '500',
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  checkText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
