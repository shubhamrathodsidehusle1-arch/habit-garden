import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme } from '../utils/theme';

export function StatsScreen() {
  const { state } = useApp();
  const theme = getTheme(state.theme);
  const { stats, habits } = state;

  // Calculate additional stats
  const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreakDays / habits.length) : 0;
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const bestHabit = habits.length > 0 
    ? habits.reduce((best, h) => h.streak > best.streak ? h : best, habits[0])
    : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>Your habit journey</Text>
        </View>

        {/* Main Stats */}
        <View style={[styles.mainCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.mainLabel}>Total Completions</Text>
          <Text style={styles.mainValue}>{stats.totalCompletions}</Text>
          <Text style={styles.mainSubtext}>habits checked off</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{stats.longestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Longest Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{completionRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Today's Rate</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{avgStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Avg Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.statEmoji}>🌱</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{habits.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active Habits</Text>
          </View>
        </View>

        {/* Best Performer */}
        {bestHabit && bestHabit.streak > 0 && (
          <View style={[styles.highlightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.highlightTitle, { color: theme.textMuted }]}>🌟 Top Performer</Text>
            <View style={styles.highlightContent}>
              <View style={[styles.highlightIcon, { backgroundColor: bestHabit.color + '20' }]}>
                <Text style={styles.highlightEmoji}>{bestHabit.icon}</Text>
              </View>
              <View style={styles.highlightInfo}>
                <Text style={[styles.highlightName, { color: theme.text }]}>{bestHabit.name}</Text>
                <Text style={[styles.highlightStreak, { color: theme.primary }]}>
                  🔥 {bestHabit.streak} day streak
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Today's Summary */}
        <View style={[styles.todayCard, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={[styles.todayTitle, { color: theme.text }]}>Today</Text>
          <View style={styles.todayStats}>
            <View style={styles.todayItem}>
              <Text style={[styles.todayValue, { color: theme.primary }]}>{completedToday}</Text>
              <Text style={[styles.todayLabel, { color: theme.textMuted }]}>Completed</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayItem}>
              <Text style={[styles.todayValue, { color: theme.text }]}>{habits.length - completedToday}</Text>
              <Text style={[styles.todayLabel, { color: theme.textMuted }]}>Remaining</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayItem}>
              <Text style={[styles.todayValue, { color: theme.text }]}>{habits.length}</Text>
              <Text style={[styles.todayLabel, { color: theme.textMuted }]}>Total</Text>
            </View>
          </View>
        </View>

        {/* Habit Breakdown */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Habit Breakdown</Text>
            {habits.map((habit) => (
              <View key={habit.id} style={[styles.habitRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                  <Text>{habit.icon}</Text>
                </View>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
                  <Text style={[styles.habitStreak, { color: theme.textMuted }]}>
                    🔥 {habit.streak} days • {habit.completedToday ? '✅ Done' : '⏳ Pending'}
                  </Text>
                </View>
                <View style={[
                  styles.habitProgress, 
                  { backgroundColor: habit.completedToday ? theme.primary : theme.surfaceSecondary }
                ]}>
                  <Text style={styles.habitProgressText}>
                    {habit.completedToday ? '✓' : '○'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  mainCard: {
    marginHorizontal: 16,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  mainLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  mainValue: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: 'bold',
  },
  mainSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  highlightCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  highlightTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  highlightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightEmoji: {
    fontSize: 24,
  },
  highlightInfo: {
    marginLeft: 12,
    flex: 1,
  },
  highlightName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightStreak: {
    fontSize: 14,
    fontWeight: '500',
  },
  todayCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayItem: {
    alignItems: 'center',
  },
  todayValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  todayLabel: {
    fontSize: 12,
  },
  todayDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitStreak: {
    fontSize: 12,
  },
  habitProgress: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitProgressText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
