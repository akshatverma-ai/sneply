import { MoodType } from '../constants';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  energyLevel: number;
  creatorRank: 'Rising' | 'Pro' | 'Legend';
  followers: number;
  following: number;
  videos: number;
  likes: number;
  achievements: Achievement[];
  createdAt: Date | import('firebase/firestore').Timestamp;
}

export interface Video {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  mode: 'spark' | 'deep';
  mood: MoodType;
  tags: string[];
  views: number;
  likes: number;
  likeCount: number;
  comments: number;
  createdAt: Date;
}

export interface CreatorRoom {
  id: string;
  creatorId: string;
  creatorName: string;
  name: string;
  description?: string;
  members: string[];
  isLive: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type MoodType = 'focus' | 'fun' | 'learn' | 'chill';

export interface TimeControl {
  dailyLimit: number;
  currentUsage: number;
  suggestions: string[];
  breaksEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppContextState {
  currentMood: MoodType;
  timeControl: TimeControl;
  energyScore: number;
  achievements: Achievement[];
}
