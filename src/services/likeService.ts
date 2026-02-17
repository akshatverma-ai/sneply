import { doc, setDoc, updateDoc, increment, serverTimestamp, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Like {
  userId: string;
  videoId: string;
  createdAt: import('firebase/firestore').FieldValue;
}

export const likeService = {
  // Like a video
  async likeVideo(userId: string, videoId: string): Promise<void> {
    try {
      console.log('🔴 Starting like process:', { userId, videoId });
      
      // Create like document
      const likeRef = doc(db, 'likes', `${userId}_${videoId}`);
      const likeData: Like = {
        userId,
        videoId,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(likeRef, likeData);
      console.log('✅ Like document created successfully');
      
      // Update video like count
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        likeCount: increment(1),
      });
      
      console.log('✅ Video like count updated successfully');
      console.log('🟢 Like process completed successfully');
      
    } catch (error) {
      console.error('❌ Like process failed:', error);
      throw new Error(`Failed to like video: ${error}`);
    }
  },

  // Unlike a video
  async unlikeVideo(userId: string, videoId: string): Promise<void> {
    try {
      console.log('🔴 Starting unlike process:', { userId, videoId });
      
      // Delete like document
      const likeRef = doc(db, 'likes', `${userId}_${videoId}`);
      await deleteDoc(likeRef);
      console.log('✅ Like document deleted successfully');
      
      // Update video like count
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        likeCount: increment(-1),
      });
      
      console.log('✅ Video like count updated successfully');
      console.log('🟢 Unlike process completed successfully');
      
    } catch (error) {
      console.error('❌ Unlike process failed:', error);
      throw new Error(`Failed to unlike video: ${error}`);
    }
  },

  // Check if user has liked a video
  async hasUserLikedVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const likeRef = doc(db, 'likes', `${userId}_${videoId}`);
      const likeDoc = await getDoc(likeRef);
      return likeDoc.exists();
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },
};
