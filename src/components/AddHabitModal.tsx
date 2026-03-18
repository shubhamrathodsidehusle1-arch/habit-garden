import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getTheme, habitColors, habitIcons } from '../utils/theme';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddHabitModal({ visible, onClose }: AddHabitModalProps) {
  const { state, addHabit } = useApp();
  const theme = getTheme(state.theme);
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💪');
  const [selectedColor, setSelectedColor] = useState(habitColors[0]);

  const handleAdd = () => {
    if (name.trim()) {
      addHabit(name.trim(), selectedIcon, selectedColor);
      setName('');
      setSelectedIcon('💪');
      setSelectedColor(habitColors[0]);
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedIcon('💪');
    setSelectedColor(habitColors[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeButton, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Habit Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.surfaceSecondary, 
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g., Morning Exercise"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={30}
            />

            <Text style={[styles.label, { color: theme.textSecondary }]}>Choose an Icon</Text>
            <View style={styles.iconGrid}>
              {habitIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: selectedIcon === icon ? theme.primary + '20' : theme.surfaceSecondary,
                      borderColor: selectedIcon === icon ? theme.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>Choose a Color</Text>
            <View style={styles.colorGrid}>
              {habitColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: color,
                      borderColor: selectedColor === color ? theme.text : 'transparent',
                      borderWidth: selectedColor === color ? 3 : 0,
                    },
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.preview}>
              <Text style={[styles.previewLabel, { color: theme.textMuted }]}>Preview</Text>
              <View style={[styles.previewCard, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                  <Text style={styles.previewIconText}>{selectedIcon}</Text>
                </View>
                <Text style={[styles.previewName, { color: theme.text }]}>
                  {name || 'Your Habit'}
                </Text>
                <Text style={[styles.previewStreak, { color: theme.textMuted }]}>🔥 0 day streak</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: name.trim() ? theme.primary : theme.textMuted },
            ]}
            onPress={handleAdd}
            disabled={!name.trim()}
          >
            <Text style={styles.addButtonText}>🌱 Plant This Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  preview: {
    marginTop: 24,
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIconText: {
    fontSize: 20,
  },
  previewName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  previewStreak: {
    fontSize: 13,
  },
  addButton: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
