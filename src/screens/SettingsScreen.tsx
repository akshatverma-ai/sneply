import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function SettingsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    Alert.alert(
      'Account Options',
      'Choose an option:',
      [
        {
          text: 'Switch Account',
          style: 'default',
          onPress: async () => {
            try {
              await signOut(getAuth());
              // Navigation will be handled automatically by AuthContext state change
              // User can login with different credentials
            } catch (error) {
              Alert.alert('Error', 'Failed to switch account. Please try again.');
            }
          },
        },
        {
          text: 'Logout & Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(getAuth());
              // Navigation will be handled automatically by AuthContext state change
              // User logged out completely
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>Logged in</Text>
            </View>
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🎨</Text>
              <Text style={styles.settingText}>Theme</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔒</Text>
              <Text style={styles.settingText}>Privacy</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>📖</Text>
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🛡️</Text>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>💬</Text>
              <Text style={styles.settingText}>Support</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Switch Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: '#ff006e',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: '#ff006e',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff006e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff006e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: '#ff006e',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
