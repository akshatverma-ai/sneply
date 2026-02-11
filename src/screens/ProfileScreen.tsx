import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import CreatorEnergyScore from '../components/features/CreatorEnergyScore';
import AchievementBadges from '../components/features/AchievementBadges';
import { COLORS, CREATOR_RANKS } from '../constants';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');
  
  const handleAchievementPress = (achievement: any) => {
    // Handle achievement press - could show modal with details
    console.log('Achievement pressed:', achievement);
  };

  if (activeTab === 'achievements') {
    return (
      <View style={styles.container}>
        <View style={styles.achievementsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.backText}>← Profile</Text>
          </TouchableOpacity>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.placeholder} />
        </View>
        
        <AchievementBadges 
          achievements={user?.achievements || []}
          onAchievementPress={handleAchievementPress}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
            <View style={styles.energyRing}>
              <CreatorEnergyScore size={140} showRank={true} />
            </View>
          </View>
          
          <Text style={styles.username}>@{user?.username || 'sneply_creator'}</Text>
          <Text style={styles.displayName}>{user?.displayName || 'Sneply Creator'}</Text>
          
          <TouchableOpacity 
            style={styles.achievementsButton}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={styles.achievementsButtonText}>
              🏆 View Achievements ({user?.achievements?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Creator Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.followers?.toLocaleString() || '1.2K'}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.videos || 89}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.likes?.toLocaleString() || '45.6K'}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>
        
        {/* Rank Progress */}
        <View style={styles.rankSection}>
          <Text style={styles.sectionTitle}>Creator Rank</Text>
          <View style={styles.rankCard}>
            <View style={styles.rankInfo}>
              <Text style={[
                styles.rankName,
                { color: CREATOR_RANKS[user?.creatorRank?.toLowerCase() as keyof typeof CREATOR_RANKS]?.color || COLORS.textSecondary }
              ]}>
                {user?.creatorRank || 'Rising'}
              </Text>
              <Text style={styles.rankDescription}>
                {user?.creatorRank === 'Legend' && 'Top-tier creator with exceptional impact'}
                {user?.creatorRank === 'Pro' && 'Established creator with growing influence'}
                {user?.creatorRank === 'Rising' && 'Emerging creator building their audience'}
                {!user?.creatorRank && 'Start creating to unlock your rank'}
              </Text>
            </View>
            
            <View style={styles.rankProgress}>
              <Text style={styles.rankProgressText}>
                Next rank in {Math.max(0, 34 - (user?.energyLevel || 0))} energy points
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bio}>
              {user?.bio || 'Content creator | Tech reviews | Lifestyle | Building the future of social media 🚀'}
            </Text>
            
            <View style={styles.bioActions}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🎬</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Uploaded new video</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🏆</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Unlocked "Rising Star" achievement</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>⚡</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Energy level increased to 85</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceHover,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  energyRing: {
    position: 'absolute',
    top: -20,
    left: -20,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  displayName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  achievementsButton: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  achievementsButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
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
  rankSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  rankCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankInfo: {
    marginBottom: 16,
  },
  rankName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  rankDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  rankProgress: {
    alignItems: 'center',
  },
  rankProgressText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  bioSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bio: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  bioActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceHover,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  activitySection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});
