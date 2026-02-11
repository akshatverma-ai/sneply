import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Video, MoodType } from '../types';

export const videoService = {
  // Upload video
  async uploadVideo(
    userId: string,
    videoFile: File,
    thumbnailFile: File,
    title: string,
    description: string,
    mode: 'spark' | 'deep',
    mood: MoodType,
    tags: string[]
  ): Promise<string> {
    try {
      // Upload video file
      const videoRef = ref(storage, `videos/${userId}/${Date.now()}-${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
      const videoUrl = await getDownloadURL(videoRef);

      // Upload thumbnail
      const thumbnailRef = ref(storage, `thumbnails/${userId}/${Date.now()}-${thumbnailFile.name}`);
      await uploadBytes(thumbnailRef, thumbnailFile);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);

      // Create video document
      const videoData: Omit<Video, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'> = {
        creatorId: userId,
        creatorName: '', // Will be populated from user data
        title,
        description,
        thumbnail: thumbnailUrl,
        videoUrl,
        duration: 0, // Will be updated after processing
        mode,
        mood,
        tags,
      };

      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      throw new Error(`Video upload failed: ${error}`);
    }
  },

  // Get feed videos based on mood
  async getFeedVideos(mood: MoodType, limitCount: number = 20): Promise<Video[]> {
    try {
      const q = query(
        collection(db, 'videos'),
        where('mood', '==', mood),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Video[];
    } catch (error) {
      throw new Error(`Failed to fetch feed videos: ${error}`);
    }
  },

  // Get user's videos
  async getUserVideos(userId: string): Promise<Video[]> {
    try {
      const q = query(
        collection(db, 'videos'),
        where('creatorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Video[];
    } catch (error) {
      throw new Error(`Failed to fetch user videos: ${error}`);
    }
  },

  // Like video
  async likeVideo(videoId: string, userId: string): Promise<void> {
    try {
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        likes: arrayUnion(userId),
      });
    } catch (error) {
      throw new Error(`Failed to like video: ${error}`);
    }
  },

  // Increment view count
  async incrementViews(videoId: string): Promise<void> {
    try {
      const videoRef = doc(db, 'videos', videoId);
      // Note: This would need to be a transaction in production
      await updateDoc(videoRef, {
        views: serverTimestamp(), // This would need proper increment logic
      });
    } catch (error) {
      throw new Error(`Failed to increment views: ${error}`);
    }
  },

  // Search videos
  async searchVideos(searchTerm: string, mood?: MoodType): Promise<Video[]> {
    try {
      let q = query(
        collection(db, 'videos'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      if (mood) {
        q = query(q, where('mood', '==', mood));
      }
      
      const querySnapshot = await getDocs(q);
      const videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Video[];
      
      // Client-side filtering for search term
      if (searchTerm) {
        return videos.filter(video => 
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      return videos;
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  },
};
