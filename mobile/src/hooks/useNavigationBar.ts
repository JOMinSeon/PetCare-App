import { useEffect, useCallback } from 'react';
import { Platform, StyleSheet, Dimensions } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function useNavigationBar() {
  const setNavigationBarAsync = useCallback(async (visibility: 'visible' | 'hidden') => {
    if (Platform.OS !== 'android') return;
    try {
      await NavigationBar.setVisibilityAsync(visibility);
    } catch {}
  }, []);

  const enableImmersiveMode = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      await NavigationBar.setBehaviorAsync('immersive-sticky');
      await NavigationBar.setVisibilityAsync('hidden');
    } catch {}
  }, []);

  const disableImmersiveMode = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      await NavigationBar.setBehaviorAsync('inset-swipe');
      await NavigationBar.setVisibilityAsync('visible');
    } catch {}
  }, []);

  useEffect(() => {
    enableImmersiveMode();

    return () => {
      disableImmersiveMode();
    };
  }, [enableImmersiveMode, disableImmersiveMode]);

  return {
    setNavigationBarAsync,
    enableImmersiveMode,
    disableImmersiveMode,
  };
}

export const navigationBarStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  content: {
    flex: 1,
  },
});
