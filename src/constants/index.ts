export const COLORS = {
  primary: '#ff006e',
  secondary: '#8338ec',
  accent: '#3a86ff',
  background: '#0a0a0a',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceHover: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.15)',
  text: '#ffffff',
  textSecondary: '#999999',
  textTertiary: '#666666',
  success: '#06ffa5',
  warning: '#ffbe0b',
  error: '#ff006e',
};

export const MOODS = {
  focus: {
    name: 'Focus',
    color: '#3a86ff',
    description: 'Deep work and concentration',
    icon: '🎯',
  },
  fun: {
    name: 'Fun',
    color: '#ff006e',
    description: 'Entertainment and enjoyment',
    icon: '🎉',
  },
  learn: {
    name: 'Learn',
    color: '#06ffa5',
    description: 'Educational content',
    icon: '📚',
  },
  chill: {
    name: 'Chill',
    color: '#8338ec',
    description: 'Relax and unwind',
    icon: '🌙',
  },
};

export const CREATOR_RANKS = {
  rising: {
    name: 'Rising',
    color: '#06ffa5',
    minEnergy: 0,
    maxEnergy: 33,
  },
  pro: {
    name: 'Pro',
    color: '#ffbe0b',
    minEnergy: 34,
    maxEnergy: 66,
  },
  legend: {
    name: 'Legend',
    color: '#ff006e',
    minEnergy: 67,
    maxEnergy: 100,
  },
};

export const VIDEO_MODES = {
  spark: {
    name: 'Spark',
    minDuration: 30,
    maxDuration: 60,
    description: 'Quick, impactful content',
  },
  deep: {
    name: 'Deep',
    minDuration: 300,
    maxDuration: 1200,
    description: 'Meaningful, in-depth content',
  },
};

export const ACHIEVEMENTS = {
  firstVideo: {
    id: 'first_video',
    name: 'First Spark',
    description: 'Upload your first video',
    icon: '✨',
    rarity: 'common' as const,
  },
  hundredViews: {
    id: 'hundred_views',
    name: 'Rising Star',
    description: 'Get 100 views on a video',
    icon: '⭐',
    rarity: 'common' as const,
  },
  thousandFollowers: {
    id: 'thousand_followers',
    name: 'Influencer',
    description: 'Reach 1000 followers',
    icon: '👑',
    rarity: 'rare' as const,
  },
  tenThousandViews: {
    id: 'ten_thousand_views',
    name: 'Viral Creator',
    description: 'Get 10,000 views on a video',
    icon: '🔥',
    rarity: 'epic' as const,
  },
  legendRank: {
    id: 'legend_rank',
    name: 'Legend',
    description: 'Achieve Legend creator rank',
    icon: '💎',
    rarity: 'legendary' as const,
  },
};

export const TIME_CONTROL_DEFAULTS = {
  dailyLimit: 120, // 2 hours in minutes
  currentUsage: 0,
  suggestions: [
    'Take a 5-minute break',
    'Try a different mood',
    'Switch to Spark mode',
  ],
  breaksEnabled: true,
};

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};
