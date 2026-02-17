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
      console.log('🔴 Starting like process:', { 
        currentUser: userId, 
        videoId: videoId 
      });
      
      // Create like document
      console.log('📝 Creating like document in Firestore...');
      const likeRef = doc(db, 'likes', `${userId}_${videoId}`);
      const likeData: Like = {
        userId,
        videoId,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(likeRef, likeData);
      console.log('✅ Like document created successfully:', {
        documentId: `${userId}_${videoId}`,
        writeSuccess: true
      });
      
      // Update video like count
      console.log('📝 Updating video like count...');
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        likeCount: increment(1),
      });
      
      console.log('✅ Video like count updated successfully:', {
        videoId: videoId,
        writeSuccess: true,
        operation: 'increment(1)'
      });
      
      console.log('🟢 Like process completed successfully:', {
        currentUser: userId,
        videoId: videoId,
        status: 'completed'
      });
      
    } catch (error) {
      console.error('❌ Like process failed:', {
        currentUser: userId,
        videoId: videoId,
        writeError: error,
        status: 'failed'
      });
      throw new Error(`Failed to like video: ${error}`);
    }
  },

  // Unlike a video
  async unlikeVideo(userId: string, videoId: string): Promise<void> {
    try {
      console.log('🔴 Starting unlike process:', { 
        currentUser: userId, 
        videoId: videoId 
      });
      
      // Delete like document
      console.log('📝 Deleting like document from Firestore...');
      const likeRef = doc(db, 'likes', `${userId}_${videoId}`);
      await deleteDoc(likeRef);
      console.log('✅ Like document deleted successfully:', {
        documentId: `${userId}_${videoId}`,
        writeSuccess: true
      });
      
      // Update video like count
      console.log('📝 Updating video like count...');
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        likeCount: increment(-1),
      });
      
      console.log('✅ Video like count updated successfully:', {
        videoId: videoId,
        writeSuccess: true,
        operation: 'increment(-1)'
      });
      
      console.log('🟢 Unlike process completed successfully:', {
        currentUser: userId,
        videoId: videoId,
        status: 'completed'
      });
      
    } catch (error) {
      console.error('❌ Unlike process failed:', {
        currentUser: userId,
        videoId: videoId,
        writeError: error,
        status: 'failed'
      });
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
