import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useApp } from '../../context/AppContext';
import { MoodType } from '../../types';
import { COLORS, MOODS } from '../../constants';

const { width } = Dimensions.get('window');

export default function MoodSelection() {
  const { currentMood, setMood } = useApp();

  const moods: { type: MoodType; config: typeof MOODS.focus }[] = [
    { type: 'focus', config: MOODS.focus },
    { type: 'fun', config: MOODS.fun },
    { type: 'learn', config: MOODS.learn },
    { type: 'chill', config: MOODS.chill },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Mood</Text>
      <Text style={styles.subtitle}>Select your current mood to personalize your feed</Text>
      
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodCard,
              currentMood === mood.type && {
                backgroundColor: mood.config.color,
                borderColor: mood.config.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => setMood(mood.type)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.moodIcon,
              currentMood === mood.type && styles.moodIconActive,
            ]}>
              <Text style={styles.emoji}>{mood.config.icon}</Text>
            </View>
            <Text style={[
              styles.moodName,
              currentMood === mood.type && styles.moodNameActive,
            ]}>
              {mood.config.name}
            </Text>
            <Text style={[
              styles.moodDescription,
              currentMood === mood.type && styles.moodDescriptionActive,
            ]}>
              {mood.config.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodIconActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  emoji: {
    fontSize: 20,
  },
  moodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  moodNameActive: {
    color: COLORS.text,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  moodDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  moodDescriptionActive: {
    color: COLORS.text,
  },
});
