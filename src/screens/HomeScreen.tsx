import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme } from '../utils/theme';
import { HabitCard, AddHabitModal } from '../components';

export function HomeScreen() {
  const { state, toggleTheme } = useApp();
  const theme = getTheme(state.theme);
  const [showAddModal, setShowAddModal] = useState(false);

  const completedCount = state.todayProgress.completed.length;
  const totalCount = state.habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>{getGreeting()}</Text>
            <Text style={[styles.title, { color: theme.text }]}>Your Habits</Text>
          </View>
          <TouchableOpacity 
            style={[styles.themeButton, { backgroundColor: theme.surfaceSecondary }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeIcon}>{state.theme === 'light' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.primary }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressCount}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressMessage}>
            {completedCount === totalCount && totalCount > 0
              ? '🎉 All done! Your garden is thriving!'
              : progressPercent > 50
              ? '💪 Keep going! Almost there!'
              : '🌱 Start your day with positive habits!'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.stats.longestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Best Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.stats.totalCompletions}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total Done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>🌱</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.habits.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Habits</Text>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Habits</Text>
          {state.habits.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={styles.emptyEmoji}>🌻</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No habits yet</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Tap the button below to plant your first habit!
              </Text>
            </View>
          ) : (
            state.habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Habit</Text>
      </TouchableOpacity>

      <AddHabitModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  progressCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCount: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressMessage: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  emptyState: {
    marginHorizontal: 16,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
