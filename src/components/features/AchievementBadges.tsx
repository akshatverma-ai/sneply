import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Achievement } from '../../types';
import { COLORS, ACHIEVEMENTS } from '../../constants';

const { width } = Dimensions.get('window');

interface AchievementBadgesProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
}

export default function AchievementBadges({ achievements, onAchievementPress }: AchievementBadgesProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return COLORS.textSecondary;
      case 'rare': return '#06ffa5';
      case 'epic': return '#8338ec';
      case 'legendary': return '#ffbe0b';
      default: return COLORS.textSecondary;
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return COLORS.border;
      case 'rare': return '#06ffa5';
      case 'epic': return '#8338ec';
      case 'legendary': return '#ffbe0b';
      default: return COLORS.border;
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ffbe0b40';
      case 'epic': return '#8338ec40';
      case 'rare': return '#06ffa540';
      default: return 'transparent';
    }
  };

  // Combine unlocked achievements with all possible achievements
  const allAchievements = Object.values(ACHIEVEMENTS).map(achievement => {
    const unlocked = achievements.find(a => a.id === achievement.id);
    return {
      ...achievement,
      unlockedAt: unlocked?.unlockedAt,
    };
  });

  const unlockedCount = achievements.length;
  const totalCount = allAchievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const renderAchievement = (achievement: Achievement & { unlockedAt?: Date }) => (
    <TouchableOpacity
      key={achievement.id}
      style={[
        styles.achievementCard,
        { borderColor: getRarityBorder(achievement.rarity) },
        achievement.unlockedAt && { 
          backgroundColor: getRarityGlow(achievement.rarity),
          borderWidth: 2,
        },
      ]}
      onPress={() => onAchievementPress?.(achievement)}
      disabled={!achievement.unlockedAt}
    >
      <View style={[
        styles.achievementIcon,
        { 
          backgroundColor: achievement.unlockedAt 
            ? getRarityColor(achievement.rarity) + '20'
            : COLORS.background,
          borderColor: getRarityBorder(achievement.rarity),
        },
      ]}>
        <Text style={[
          styles.achievementEmoji,
          { 
            opacity: achievement.unlockedAt ? 1 : 0.3,
            color: achievement.unlockedAt 
              ? getRarityColor(achievement.rarity)
              : COLORS.textTertiary,
          },
        ]}>
          {achievement.icon}
        </Text>
      </View>
      
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementName,
          { 
            color: achievement.unlockedAt 
              ? COLORS.text 
              : COLORS.textTertiary,
          },
        ]}>
          {achievement.name}
        </Text>
        <Text style={[
          styles.achievementDescription,
          { 
            color: achievement.unlockedAt 
              ? COLORS.textSecondary 
              : COLORS.textTertiary,
          },
        ]}>
          {achievement.description}
        </Text>
        
        {achievement.unlockedAt && (
          <Text style={styles.unlockedDate}>
            Unlocked {achievement.unlockedAt.toLocaleDateString()}
          </Text>
        )}
        
        {!achievement.unlockedAt && (
          <Text style={styles.lockedText}>🔒 Locked</Text>
        )}
      </View>
      
      <View style={[
        styles.rarityBadge,
        { backgroundColor: getRarityColor(achievement.rarity) },
      ]}>
        <Text style={styles.rarityText}>
          {achievement.rarity.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Achievement Progress</Text>
        <Text style={styles.progressSubtitle}>
          {unlockedCount} of {totalCount} badges unlocked
        </Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
            ]} 
          />
        </View>
        
        <Text style={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* Achievement Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allAchievements.filter(a => a.rarity === 'legendary').length}
          </Text>
          <Text style={styles.statLabel}>Legendary</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allAchievements.filter(a => a.rarity === 'epic').length}
          </Text>
          <Text style={styles.statLabel}>Epic</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allAchievements.filter(a => a.rarity === 'rare').length}
          </Text>
          <Text style={styles.statLabel}>Rare</Text>
        </View>
      </View>

      {/* Achievements List */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsScroll}
      >
        {allAchievements.map(renderAchievement)}
      </ScrollView>

      {/* Achievement Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🎬</Text>
            <Text style={styles.categoryName}>Content</Text>
            <Text style={styles.categoryCount}>
              {allAchievements.filter(a => a.id.includes('video')).length}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>👥</Text>
            <Text style={styles.categoryName}>Social</Text>
            <Text style={styles.categoryCount}>
              {allAchievements.filter(a => a.id.includes('followers')).length}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>⚡</Text>
            <Text style={styles.categoryName}>Energy</Text>
            <Text style={styles.categoryCount}>
              {allAchievements.filter(a => a.id.includes('rank')).length}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🔥</Text>
            <Text style={styles.categoryName}>Viral</Text>
            <Text style={styles.categoryCount}>
              {allAchievements.filter(a => a.id.includes('views')).length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textShadowColor: COLORS.warning,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  progressSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.warning,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  achievementCard: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  unlockedDate: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '600',
  },
  lockedText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.text,
  },
  categoriesContainer: {
    padding: 20,
    paddingTop: 10,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
});
