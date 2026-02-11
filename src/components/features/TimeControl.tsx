import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

interface TimeControlProps {
  visible: boolean;
  onClose: () => void;
}

export default function TimeControl({ visible, onClose }: TimeControlProps) {
  const { timeControl, updateTimeControl } = useApp();
  const [breakTimer, setBreakTimer] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOnBreak && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            setIsOnBreak(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak, breakTimer]);

  const startBreak = (duration: number) => {
    setIsOnBreak(true);
    setBreakTimer(duration * 60); // Convert minutes to seconds
    Alert.alert('Break Started', `Take a ${duration} minute break to rest your eyes and mind.`);
  };

  const adjustDailyLimit = (newLimit: number) => {
    updateTimeControl({ dailyLimit: newLimit });
  };

  const getUsagePercentage = () => {
    return (timeControl.currentUsage / timeControl.dailyLimit) * 100;
  };

  const getTimeColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return COLORS.error;
    if (percentage >= 75) return COLORS.warning;
    if (percentage >= 50) return COLORS.accent;
    return COLORS.success;
  };

  const getSuggestion = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'Consider taking a break and continuing tomorrow';
    if (percentage >= 75) return 'Switch to Spark mode for shorter content';
    if (percentage >= 50) return 'Try a different mood to refresh your feed';
    return 'You\'re doing great! Keep creating and exploring';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Time Control</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Current Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Usage</Text>
          <View style={styles.usageContainer}>
            <View style={styles.usageBar}>
              <View 
                style={[
                  styles.usageFill,
                  { 
                    width: `${Math.min(getUsagePercentage(), 100)}%`,
                    backgroundColor: getTimeColor(),
                  }
                ]} 
              />
            </View>
            <Text style={[styles.usageText, { color: getTimeColor() }]}>
              {formatTime(timeControl.currentUsage)} / {formatTime(timeControl.dailyLimit)}
            </Text>
          </View>
          <Text style={styles.suggestion}>{getSuggestion()}</Text>
        </View>

        {/* Break Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Take a Break</Text>
          {isOnBreak ? (
            <View style={styles.breakContainer}>
              <Text style={styles.breakText}>
                Break in progress: {Math.floor(breakTimer / 60)}:{(breakTimer % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          ) : (
            <View style={styles.breakButtons}>
              <TouchableOpacity
                style={[styles.breakButton, { backgroundColor: COLORS.success }]}
                onPress={() => startBreak(5)}
              >
                <Text style={styles.breakButtonText}>5 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.breakButton, { backgroundColor: COLORS.accent }]}
                onPress={() => startBreak(10)}
              >
                <Text style={styles.breakButtonText}>10 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.breakButton, { backgroundColor: COLORS.warning }]}
                onPress={() => startBreak(15)}
              >
                <Text style={styles.breakButtonText}>15 min</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Daily Limit Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Limit</Text>
          <Text style={styles.limitDescription}>
            Set your daily screen time limit to maintain healthy usage habits
          </Text>
          <View style={styles.limitButtons}>
            {[60, 90, 120, 180, 240].map((limit) => (
              <TouchableOpacity
                key={limit}
                style={[
                  styles.limitButton,
                  timeControl.dailyLimit === limit && styles.limitButtonActive
                ]}
                onPress={() => adjustDailyLimit(limit)}
              >
                <Text style={[
                  styles.limitButtonText,
                  timeControl.dailyLimit === limit && styles.limitButtonTextActive
                ]}>
                  {formatTime(limit)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intelligent Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>
          <View style={styles.suggestionsList}>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionIcon}>🎯</Text>
              <Text style={styles.suggestionText}>
                Focus on creating longer Deep content when you have more energy
              </Text>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionIcon}>⚡</Text>
              <Text style={styles.suggestionText}>
                Use Spark mode for quick content during short breaks
              </Text>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionIcon}>🔄</Text>
              <Text style={styles.suggestionText}>
                Switch moods regularly to discover diverse content
              </Text>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionIcon}>🏆</Text>
              <Text style={styles.suggestionText}>
                Complete achievements to unlock new features and boost energy
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.surfaceHover }]}
            onPress={onClose}
          >
            <Text style={styles.actionButtonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.warning }]}
            onPress={() => {
              updateTimeControl({ currentUsage: 0 });
              Alert.alert('Reset', 'Daily usage has been reset');
            }}
          >
            <Text style={styles.actionButtonText}>Reset Usage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  usageContainer: {
    alignItems: 'center',
  },
  usageBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    borderRadius: 4,
  },
  usageText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  breakContainer: {
    backgroundColor: COLORS.success + '20',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  breakText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
  breakButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  breakButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  breakButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  limitDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  limitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  limitButton: {
    flex: 1,
    minWidth: 80,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  limitButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  limitButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  limitButtonTextActive: {
    color: COLORS.text,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
