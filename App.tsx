import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { HomeScreen, GardenScreen, StatsScreen } from './src/screens';
import { getTheme } from './src/utils/theme';

type Tab = 'home' | 'garden' | 'stats';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { state } = useApp();
  const theme = getTheme(state.theme);

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'garden', icon: '🌳', label: 'Garden' },
    { id: 'stats', icon: '📊', label: 'Stats' },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={[styles.tabIcon, activeTab === tab.id && styles.tabIconActive]}>
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? theme.primary : theme.textMuted },
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.id && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { state } = useApp();
  const theme = getTheme(state.theme);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'garden':
        return <GardenScreen />;
      case 'stats':
        return <StatsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar
        barStyle={state.theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIndicator: {
    position: 'absolute',
    top: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
