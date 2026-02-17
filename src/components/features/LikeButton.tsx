import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { likeService } from '../../services/likeService';
import { COLORS } from '../../constants';

interface LikeButtonProps {
  videoId: string;
  initialLikeCount: number;
  onLikeCountChange?: (newCount: number) => void;
}

export default function LikeButton({ videoId, initialLikeCount, onLikeCountChange }: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already liked the video
  useEffect(() => {
    if (user) {
      likeService.hasUserLikedVideo(user.id, videoId)
        .then(setIsLiked)
        .catch(error => console.error('Error checking like status:', error));
    }
  }, [user, videoId]);

  const handleLikePress = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    
    try {
      if (isLiked) {
        // Unlike the video
        await likeService.unlikeVideo(user.id, videoId);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        console.log('🟢 Video unliked successfully');
      } else {
        // Like the video
        await likeService.likeVideo(user.id, videoId);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        console.log('🟢 Video liked successfully');
      }
      
      // Notify parent component of like count change
      if (onLikeCountChange) {
        onLikeCountChange(likeCount + (isLiked ? -1 : 1));
      }
      
    } catch (error) {
      console.error('❌ Like button error:', error);
      // You could show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.likeButton,
        isLiked && styles.likeButtonLiked,
        isLoading && styles.likeButtonDisabled
      ]}
      onPress={handleLikePress}
      disabled={!user || isLoading}
    >
      <Text style={[
        styles.likeText,
        isLiked && styles.likeTextLiked
      ]}>
        {isLiked ? '❤️' : '🤍'} {likeCount}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  likeButtonLiked: {
    backgroundColor: 'rgba(255, 0, 110, 0.2)',
    borderColor: 'rgba(255, 0, 110, 0.4)',
  },
  likeButtonDisabled: {
    opacity: 0.5,
  },
  likeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  likeTextLiked: {
    color: '#ff006e',
  },
});
