import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

function LoadingScreen(): JSX.Element {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.logo}>🐾</Text>
      <Text style={styles.title}>VitalPaw</Text>
      <ActivityIndicator size="large" color="#008B8B" style={styles.spinner} />
    </View>
  );
}

export function RootNavigator(): JSX.Element {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      // Small delay to ensure auth state is fully propagated
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (!isReady || isLoading) {
    return (
      <NavigationContainer>
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008B8B',
    marginBottom: 24,
  },
  spinner: {
    marginTop: 20,
  },
});

export default RootNavigator;
