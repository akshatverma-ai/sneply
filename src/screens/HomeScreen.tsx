import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import MoodSelection from '../components/features/MoodSelection';
import CreatorEnergyScore from '../components/features/CreatorEnergyScore';
import TimeControl from '../components/features/TimeControl';
import { COLORS, MOODS, VIDEO_MODES } from '../constants';

const { width } = Dimensions.get('window');

// Mock mixed content data (Spark + Deep videos)
const mixedContent = [
  {
    id: '1',
    creatorName: 'TechWizard',
    title: 'Quick coding tip! 💡',
    description: 'Learn this amazing React Native trick in 30 seconds',
    thumbnail: 'https://picsum.photos/seed/mix1/400/225',
    duration: 45,
    mode: 'spark',
    mood: 'learn',
    views: '12.5K',
    likes: '892',
    energyScore: 85,
  },
  {
    id: '2',
    creatorName: 'PhilosopherPro',
    title: 'The Meaning of Digital Consciousness',
    description: 'A deep dive into how technology is reshaping human awareness',
    thumbnail: 'https://picsum.photos/seed/mix2/400/225',
    duration: 942, // 15:42
    mode: 'deep',
    mood: 'learn',
    views: '125K',
    likes: '8.9K',
    energyScore: 92,
  },
  {
    id: '3',
    creatorName: 'FoodieLife',
    title: '30sec recipe hack 🍳',
    description: 'Amazing kitchen trick that will blow your mind',
    thumbnail: 'https://picsum.photos/seed/mix3/400/225',
    duration: 30,
    mode: 'spark',
    mood: 'fun',
    views: '45.2K',
    likes: '3.1K',
    energyScore: 78,
  },
  {
    id: '4',
    creatorName: 'MindfulLiving',
    title: 'The Art of Digital Detox',
    description: 'Practical strategies for maintaining mental clarity',
    thumbnail: 'https://picsum.photos/seed/mix4/400/225',
    duration: 1110, // 18:30
    mode: 'deep',
    mood: 'chill',
    views: '67K',
    likes: '4.5K',
    energyScore: 88,
  },
  {
    id: '5',
    creatorName: 'FitnessGuru',
    title: 'Morning workout boost 🔥',
    description: 'Quick energy boost to start your day right',
    thumbnail: 'https://picsum.photos/seed/mix5/400/225',
    duration: 60,
    mode: 'spark',
    mood: 'focus',
    views: '28.7K',
    likes: '2.4K',
    energyScore: 75,
  },
];

export default function HomeScreen() {
  const { currentMood, timeControl } = useApp();
  const [filteredContent, setFilteredContent] = useState(mixedContent);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showTimeControl, setShowTimeControl] = useState(false);

  const moodConfig = MOODS[currentMood];

  // AI-powered content filtering based on mood and time
  useEffect(() => {
    const filtered = mixedContent.filter(item => {
      // Filter by current mood
      const moodMatch = item.mood === currentMood;
      
      // Time-based filtering (intelligent suggestions)
      const timeScore = timeControl.currentUsage / timeControl.dailyLimit;
      const shouldShowLongContent = timeScore < 0.7; // Show deep content if less than 70% of daily limit
      
      if (item.mode === 'deep' && !shouldShowLongContent) {
        return false;
      }
      
      return moodMatch;
    });

    // Sort by energy score and engagement
    const sorted = filtered.sort((a, b) => {
      const scoreA = a.energyScore + (parseInt(a.likes) / 1000);
      const scoreB = b.energyScore + (parseInt(b.likes) / 1000);
      return scoreB - scoreA;
    });

    setFilteredContent(sorted);

    // Show time warning if approaching limit
    if (timeControl.currentUsage > timeControl.dailyLimit * 0.8) {
      setShowTimeWarning(true);
    }
  }, [currentMood, timeControl]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const renderContentItem = ({ item }: { item: typeof mixedContent[0] }) => (
    <TouchableOpacity style={styles.contentCard}>
      <View style={styles.thumbnailContainer}>
        <View style={[styles.thumbnail, { backgroundColor: moodConfig.color + '20' }]}>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>
              {item.mode === 'spark' ? '⚡' : '🧠'} {VIDEO_MODES[item.mode as keyof typeof VIDEO_MODES].name}
            </Text>
          </View>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
      </View>
      
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.contentMeta}>
          <View style={styles.creatorInfo}>
            <View style={styles.avatar} />
            <Text style={styles.creatorName}>{item.creatorName}</Text>
            <View style={styles.energyIndicator}>
              <Text style={styles.energyText}>⚡ {item.energyScore}</Text>
            </View>
          </View>
          
          <View style={styles.contentStats}>
            <Text style={styles.views}>{item.views} views</Text>
            <Text style={styles.likes}>❤️ {item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sneply Feed</Text>
          <Text style={styles.subtitle}>AI-powered content for your {moodConfig.name.toLowerCase()} mood</Text>
        </View>

        {/* Time Control Warning */}
        {showTimeWarning && (
          <View style={styles.timeWarning}>
            <Text style={styles.warningText}>⏰ You're approaching your daily time limit</Text>
            <TouchableOpacity style={styles.takeBreakButton}>
              <Text style={styles.takeBreakText}>Take a Break</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.timeControlButton}
              onPress={() => setShowTimeControl(true)}
            >
              <Text style={styles.timeControlButtonText}>Manage Time</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Time Control Modal */}
        <TimeControl 
          visible={showTimeControl}
          onClose={() => setShowTimeControl(false)}
        />

        {/* Mood Selection */}
        <MoodSelection />

        {/* Creator Energy Score */}
        <View style={styles.energySection}>
          <Text style={styles.sectionTitle}>Your Energy Level</Text>
          <View style={styles.energyContainer}>
            <CreatorEnergyScore size={80} showRank={false} />
            <View style={styles.energyInfo}>
              <Text style={styles.energyTitle}>Content Creator Energy</Text>
              <Text style={styles.energyDescription}>
                Higher energy = better content recommendations
              </Text>
              <TouchableOpacity style={styles.boostButton}>
                <Text style={styles.boostText}>⚡ Boost Energy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI Feed */}
        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <Text style={styles.sectionTitle}>For You</Text>
            <Text style={styles.feedDescription}>
              {filteredContent.length} videos matched to your {moodConfig.name} mood
            </Text>
          </View>
          
          <FlatList
            data={filteredContent}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  timeWarning: {
    backgroundColor: COLORS.warning + '20',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.warning,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  takeBreakButton: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  takeBreakText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  timeControlButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  timeControlButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  energySection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  energyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  energyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  energyDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  boostButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  boostText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  feedSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  feedHeader: {
    marginBottom: 16,
  },
  feedDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  separator: {
    height: 16,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  modeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  contentInfo: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  contentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHover,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  energyIndicator: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  energyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
  contentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  views: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  likes: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});
