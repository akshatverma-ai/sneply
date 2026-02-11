import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator 
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
      presentation: 'modal',
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Main" component={TabNavigator} />
  </Stack.Navigator>
);

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
