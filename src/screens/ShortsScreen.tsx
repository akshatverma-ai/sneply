import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  StatusBar
} from 'react-native';
import { Video } from 'expo-av';
import { useApp } from '../context/AppContext';
import { COLORS, MOODS } from '../constants';

const { height, width } = Dimensions.get('window');

// Mock spark videos data
const sparkVideos = [
  {
    id: '1',
    creatorName: 'TechWizard',
    title: 'Quick coding tip! 💡',
    views: '12.5K',
    likes: '892',
    thumbnail: 'https://picsum.photos/seed/spark1/400/700',
    videoUrl: 'https://example.com/video1.mp4',
  },
  {
    id: '2',
    creatorName: 'FoodieLife',
    title: '30sec recipe hack 🍳',
    views: '45.2K',
    likes: '3.1K',
    thumbnail: 'https://picsum.photos/seed/spark2/400/700',
    videoUrl: 'https://example.com/video2.mp4',
  },
  {
    id: '3',
    creatorName: 'FitnessGuru',
    title: 'Morning workout boost 🔥',
    views: '28.7K',
    likes: '2.4K',
    thumbnail: 'https://picsum.photos/seed/spark3/400/700',
    videoUrl: 'https://example.com/video3.mp4',
  },
];

export default function ShortsScreen() {
  const { currentMood } = useApp();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentVideo = sparkVideos[currentVideoIndex];
  const moodConfig = MOODS[currentMood];

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(y / height);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < sparkVideos.length) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentVideoIndex(newIndex);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleLike = () => {
    // Handle like animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sparkVideos.map((video, index) => (
          <View key={video.id} style={styles.videoContainer}>
            {/* Video Background */}
            <View style={[styles.videoBackground, { backgroundColor: moodConfig.color + '20' }]}>
              <Text style={styles.placeholderText}>Spark Video {index + 1}</Text>
            </View>
            
            {/* Video Overlay - Only show for current video */}
            {index === currentVideoIndex && (
              <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                {/* Top Controls */}
                <View style={styles.topControls}>
                  <TouchableOpacity style={styles.moodIndicator}>
                    <Text style={styles.moodText}>{moodConfig.icon} {moodConfig.name}</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Side Actions */}
                <View style={styles.sideActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionText}>{video.likes}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>142</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>↪️</Text>
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>⭐</Text>
                    <Text style={styles.actionText}>Save</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Bottom Info */}
                <View style={styles.bottomInfo}>
                  <View style={styles.creatorInfo}>
                    <View style={styles.avatar} />
                    <View style={styles.creatorDetails}>
                      <Text style={styles.creatorName}>@{video.creatorName}</Text>
                      <Text style={styles.videoTitle}>{video.title}</Text>
                    </View>
                    <TouchableOpacity style={styles.followButton}>
                      <Text style={styles.followText}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.videoStats}>
                    <Text style={styles.views}>{video.views} views</Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    height: height,
    width: width,
    position: 'relative',
  },
  videoBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    alignItems: 'flex-end',
  },
  moodIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  sideActions: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 80,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  videoTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  videoStats: {
    marginTop: 8,
  },
  views: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
