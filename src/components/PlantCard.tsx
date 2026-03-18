import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme } from '../utils/theme';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
}

const getPlantEmoji = (type: Plant['type'], growthLevel: number): string => {
  const plantMap: Record<Plant['type'], string[]> = {
    succulent: ['🌱', '🌵', '🌵', '🏵️'],
    fern: ['🌱', '🌿', '🌿', '🌳'],
    flower: ['🌱', '🌸', '🌺', '💐'],
    tree: ['🌱', '🌲', '🌳', '🌲'],
    cactus: ['🌱', '🌵', '🌵', '🏵️'],
    bonsai: ['🌱', '🌲', '🌲', '🎋'],
    herb: ['🌱', '🌿', '🌿', '💐'],
    vine: ['🌱', '🌿', '🍃', '🍂'],
  };
  
  const emojis = plantMap[type] || plantMap.succulent;
  if (growthLevel < 25) return emojis[0];
  if (growthLevel < 50) return emojis[1];
  if (growthLevel < 75) return emojis[2];
  return emojis[3];
};

const getPlantName = (type: Plant['type']): string => {
  const names: Record<Plant['type'], string> = {
    succulent: 'Succulent',
    fern: 'Fern',
    flower: 'Flower',
    tree: 'Tree',
    cactus: 'Cactus',
    bonsai: 'Bonsai',
    herb: 'Herb',
    vine: 'Vine',
  };
  return names[type] || 'Plant';
};

export function PlantCard({ plant }: PlantCardProps) {
  const { state } = useApp();
  const theme = getTheme(state.theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.plantDisplay}>
        <Text style={styles.emoji}>{getPlantEmoji(plant.type, plant.growthLevel)}</Text>
        <View style={[styles.growthBar, { backgroundColor: theme.surfaceSecondary }]}>
          <View 
            style={[
              styles.growthFill, 
              { 
                width: `${plant.growthLevel}%`,
                backgroundColor: theme.primary 
              }
            ]} 
          />
        </View>
      </View>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {plant.name}
      </Text>
      <Text style={[styles.type, { color: theme.textMuted }]}>
        {getPlantName(plant.type)} • Lv.{Math.floor(plant.growthLevel / 25) + 1}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  plantDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  growthBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  growthFill: {
    height: '100%',
    borderRadius: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
  },
});
