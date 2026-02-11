import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, MOODS } from '../constants';

const { width, height } = Dimensions.get('window');

// Mock deep videos data
const deepVideos = [
  {
    id: '1',
    creatorName: 'PhilosopherPro',
    title: 'The Meaning of Digital Consciousness',
    description: 'A deep dive into how technology is reshaping human awareness and what it means to be conscious in the digital age.',
    duration: '15:42',
    views: '125K',
    likes: '8.9K',
    thumbnail: 'https://picsum.photos/seed/deep1/400/225',
    mode: 'deep',
    mood: 'learn',
    tags: ['philosophy', 'technology', 'consciousness'],
  },
  {
    id: '2',
    creatorName: 'ScienceMasters',
    title: 'Quantum Computing Explained Simply',
    description: 'Understanding the fundamentals of quantum computing and its potential to revolutionize our world.',
    duration: '12:18',
    views: '89K',
    likes: '6.2K',
    thumbnail: 'https://picsum.photos/seed/deep2/400/225',
    mode: 'deep',
    mood: 'learn',
    tags: ['science', 'quantum', 'technology'],
  },
  {
    id: '3',
    creatorName: 'MindfulLiving',
    title: 'The Art of Digital Detox',
    description: 'Practical strategies for maintaining mental clarity and focus in an increasingly connected world.',
    duration: '18:30',
    views: '67K',
    likes: '4.5K',
    thumbnail: 'https://picsum.photos/seed/deep3/400/225',
    mode: 'deep',
    mood: 'chill',
    tags: ['mindfulness', 'wellness', 'digital-detox'],
  },
];

export default function DeepModeScreen() {
  const { currentMood } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const moodConfig = MOODS[currentMood];
  
  const categories = [
    { id: 'all', name: 'All', color: COLORS.textSecondary },
    { id: 'learn', name: 'Learn', color: MOODS.learn.color },
    { id: 'focus', name: 'Focus', color: MOODS.focus.color },
    { id: 'chill', name: 'Chill', color: MOODS.chill.color },
    { id: 'fun', name: 'Fun', color: MOODS.fun.color },
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? deepVideos 
    : deepVideos.filter(video => video.mood === selectedCategory);

  const renderVideoItem = ({ item }: { item: typeof deepVideos[0] }) => (
    <TouchableOpacity style={styles.videoCard}>
      <View style={styles.thumbnailContainer}>
        <View style={[styles.thumbnail, { backgroundColor: moodConfig.color + '20' }]}>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.videoMeta}>
          <View style={styles.creatorInfo}>
            <View style={styles.avatar} />
            <Text style={styles.creatorName}>{item.creatorName}</Text>
          </View>
          
          <View style={styles.videoStats}>
            <Text style={styles.views}>{item.views} views</Text>
            <Text style={styles.likes}>❤️ {item.likes}</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Deep Mode</Text>
        <Text style={styles.subtitle}>Meaningful, in-depth content</Text>
        
        {/* Mood Indicator */}
        <View style={styles.moodIndicator}>
          <Text style={styles.moodText}>{moodConfig.icon} {moodConfig.name} Mode</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && {
                backgroundColor: category.color,
                borderColor: category.color,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Videos List */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.videosList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  moodIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingRight: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.text,
  },
  videosList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  videoCard: {
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
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 12,
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
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    marginLeft: 2,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  videoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  videoStats: {
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
