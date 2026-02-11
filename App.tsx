import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <View style={styles.container}>
            <RootNavigator />
            <StatusBar style="light" />
          </View>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
