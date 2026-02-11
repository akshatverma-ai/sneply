import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodType, TimeControl, AppContextState } from '../types';
import { TIME_CONTROL_DEFAULTS } from '../constants';

interface AppContextType extends AppContextState {
  setMood: (mood: MoodType) => void;
  updateTimeControl: (updates: Partial<TimeControl>) => void;
  incrementEnergyScore: (amount: number) => void;
  resetDailyUsage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('focus');
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROL_DEFAULTS);
  const [energyScore, setEnergyScore] = useState<number>(0);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Load saved data on app start
  useEffect(() => {
    loadSavedData();
    setupDailyReset();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedMood = await AsyncStorage.getItem('currentMood');
      const savedTimeControl = await AsyncStorage.getItem('timeControl');
      const savedEnergyScore = await AsyncStorage.getItem('energyScore');

      if (savedMood) {
        setCurrentMood(savedMood as MoodType);
      }
      if (savedTimeControl) {
        setTimeControl(JSON.parse(savedTimeControl));
      }
      if (savedEnergyScore) {
        setEnergyScore(parseInt(savedEnergyScore, 10));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const setupDailyReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      resetDailyUsage();
      setInterval(resetDailyUsage, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, msUntilMidnight);
  };

  const setMood = async (mood: MoodType) => {
    setCurrentMood(mood);
    try {
      await AsyncStorage.setItem('currentMood', mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const updateTimeControl = async (updates: Partial<TimeControl>) => {
    const newTimeControl = { ...timeControl, ...updates };
    setTimeControl(newTimeControl);
    try {
      await AsyncStorage.setItem('timeControl', JSON.stringify(newTimeControl));
    } catch (error) {
      console.error('Error saving time control:', error);
    }
  };

  const incrementEnergyScore = async (amount: number) => {
    const newScore = Math.min(100, energyScore + amount);
    setEnergyScore(newScore);
    try {
      await AsyncStorage.setItem('energyScore', newScore.toString());
    } catch (error) {
      console.error('Error saving energy score:', error);
    }
  };

  const resetDailyUsage = async () => {
    const newTimeControl = { ...timeControl, currentUsage: 0 };
    setTimeControl(newTimeControl);
    try {
      await AsyncStorage.setItem('timeControl', JSON.stringify(newTimeControl));
    } catch (error) {
      console.error('Error resetting daily usage:', error);
    }
  };

  const value: AppContextType = {
    currentMood,
    timeControl,
    energyScore,
    achievements,
    setMood,
    updateTimeControl,
    incrementEnergyScore,
    resetDailyUsage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
