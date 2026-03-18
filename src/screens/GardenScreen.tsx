import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme } from '../utils/theme';
import { PlantCard } from '../components';

export function GardenScreen() {
  const { state } = useApp();
  const theme = getTheme(state.theme);

  const avgGrowth = state.plants.length > 0
    ? Math.round(state.plants.reduce((sum, p) => sum + p.growthLevel, 0) / state.plants.length)
    : 0;

  const getGardenMessage = () => {
    if (state.plants.length === 0) {
      return "Your garden is empty! Add habits to grow your garden.";
    }
    if (avgGrowth >= 75) {
      return "🌳 Your garden is thriving! Amazing consistency!";
    }
    if (avgGrowth >= 50) {
      return "🌿 Your plants are growing well! Keep it up!";
    }
    if (avgGrowth >= 25) {
      return "🌱 Your seedlings are sprouting!";
    }
    return "🌰 Just planted! Start completing habits to see growth.";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Your Garden</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            🌱 {state.plants.length} plants growing
          </Text>
        </View>

        {/* Garden Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.primary }]}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{avgGrowth}%</Text>
              <Text style={styles.statLabel}>Avg Growth</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {state.plants.filter(p => p.growthLevel >= 75).length}
              </Text>
              <Text style={styles.statLabel}>Thriving</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {state.plants.filter(p => p.growthLevel < 25).length}
              </Text>
              <Text style={styles.statLabel}>Seedlings</Text>
            </View>
          </View>
          <Text style={styles.message}>{getGardenMessage()}</Text>
        </View>

        {/* Garden Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Plant Collection</Text>
          {state.plants.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={styles.emptyEmoji}>🏡</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Empty Garden</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Add habits from the Home tab to grow plants in your garden!
              </Text>
            </View>
          ) : (
            <View style={styles.plantGrid}>
              {state.plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </View>
          )}
        </View>

        {/* Garden Level Progress */}
        {state.plants.length > 0 && (
          <View style={[styles.levelCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.levelHeader}>
              <Text style={[styles.levelTitle, { color: theme.text }]}>Garden Level</Text>
              <Text style={[styles.levelValue, { color: theme.primary }]}>Lv.{state.stats.gardenLevel}</Text>
            </View>
            <View style={[styles.levelBar, { backgroundColor: theme.surfaceSecondary }]}>
              <View 
                style={[
                  styles.levelFill, 
                  { 
                    width: `${(state.stats.totalCompletions % 100)}%`,
                    backgroundColor: theme.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.levelText, { color: theme.textMuted }]}>
              {100 - (state.stats.totalCompletions % 100)} more completions to Level {state.stats.gardenLevel + 1}
            </Text>
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
  statsCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
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
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
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
  levelCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 100,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  levelValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelText: {
    fontSize: 13,
  },
});
