import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../src/contexts/AuthContext';
import { PetProvider } from '../src/contexts/PetContext';
import { HealthProvider } from '../src/contexts/HealthContext';
import { ReminderProvider } from '../src/contexts/ReminderContext';
import { PostProvider } from '../src/contexts/PostContext';
import { AnalyticsProvider } from '../src/contexts/AnalyticsContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PetProvider>
        <HealthProvider>
          <ReminderProvider>
            <PostProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </PostProvider>
          </ReminderProvider>
        </HealthProvider>
      </PetProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pet" options={{ headerShown: true, title: '반려동물' }} />
          <Stack.Screen name="health" options={{ headerShown: true, title: '건강 기록' }} />
          <Stack.Screen name="reminder" options={{ headerShown: true, title: '리마인더' }} />
          <Stack.Screen name="community" options={{ headerShown: true, title: '커뮤니티' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </AppProviders>
    </ThemeProvider>
  );
}