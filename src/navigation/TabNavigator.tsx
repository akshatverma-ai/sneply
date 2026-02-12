import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, MOODS } from '../constants';
import HomeScreen from '../screens/HomeScreen';
import ShortsScreen from '../screens/ShortsScreen';
import DeepModeScreen from '../screens/DeepModeScreen';
import UploadScreen from '../screens/UploadScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, mood }: { focused: boolean; mood: string }) => {
  const moodConfig = MOODS[mood as keyof typeof MOODS];
  
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <View style={[
        styles.iconDot, 
        { backgroundColor: moodConfig.color }
      ]} />
      <Text style={[
        styles.iconText,
        focused && styles.iconTextFocused,
        { color: focused ? moodConfig.color : COLORS.textSecondary }
      ]}>
        {moodConfig.name}
      </Text>
    </View>
  );
};

export default function TabNavigator() {
  const { currentMood } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.primary : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.primary : COLORS.textSecondary }
              ]}>
                Feed
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Shorts" 
        component={ShortsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.accent : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.accent : COLORS.textSecondary }
              ]}>
                Spark
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="DeepMode" 
        component={DeepModeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.secondary : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.secondary : COLORS.textSecondary }
              ]}>
                Deep
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.success : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.success : COLORS.textSecondary }
              ]}>
                Create
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.secondary : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.secondary : COLORS.textSecondary }
              ]}>
                Rooms
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.warning : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.warning : COLORS.textSecondary }
              ]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <View style={[
                styles.iconDot, 
                { backgroundColor: focused ? COLORS.error : COLORS.textSecondary }
              ]} />
              <Text style={[
                styles.iconText,
                { color: focused ? COLORS.error : COLORS.textSecondary }
              ]}>
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabBarBackground: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconTextFocused: {
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
