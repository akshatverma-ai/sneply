import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { COLORS, CREATOR_RANKS } from '../../constants';

const { width } = Dimensions.get('window');

interface CreatorEnergyScoreProps {
  size?: number;
  showRank?: boolean;
  animated?: boolean;
}

export default function CreatorEnergyScore({ 
  size = 120, 
  showRank = true, 
  animated = true 
}: CreatorEnergyScoreProps) {
  const { user } = useAuth();
  const { energyScore } = useApp();
  
  const score = user?.energyLevel || energyScore;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Determine rank based on score
  let rank = 'rising';
  let rankColor = CREATOR_RANKS.rising.color;
  
  if (score >= CREATOR_RANKS.pro.minEnergy) {
    rank = 'pro';
    rankColor = CREATOR_RANKS.pro.color;
  }
  if (score >= CREATOR_RANKS.legend.minEnergy) {
    rank = 'legend';
    rankColor = CREATOR_RANKS.legend.color;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle with neon glow */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={rankColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={[styles.score, { color: rankColor }]}>
          {score}
        </Text>
        <Text style={styles.scoreLabel}>
          Energy
        </Text>
        {showRank && (
          <Text style={[styles.rank, { color: rankColor }]}>
            {CREATOR_RANKS[rank as keyof typeof CREATOR_RANKS].name}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  progressCircle: {
    // Additional animation styles can be added here
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  rank: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
