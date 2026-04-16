import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { StatusBar } from 'react-native';
import HomeDashboardScreen from './src/screens/HomeDashboardScreen';
import SymptomCaptureScreen from './src/screens/SymptomCaptureScreen';
import AnalysisResultScreen from './src/screens/AnalysisResultScreen';
import SymptomHistoryScreen from './src/screens/SymptomHistoryScreen';
import { Pet, AnalysisResult, SymptomAnalysis } from './src/types';
import { getSymptomHistory } from './src/services/api';
import { theme } from './src/theme';
import { useNavigationBar } from './src/hooks/useNavigationBar';

const SymptomTrackerScreen = lazy(() => import('./src/screens/SymptomTrackerScreen'));
const PetServiceMapScreen = lazy(() => import('./src/screens/PetServiceMapScreen'));
const DietPlannerScreen = lazy(() => import('./src/screens/DietPlannerScreen'));
const DigitalPetIDScreen = lazy(() => import('./src/screens/DigitalPetIDScreen'));

type TabName = 'home' | 'tracker' | 'map' | 'diet' | 'petid';
type Screen = TabName | 'capture' | 'result' | 'history';

interface TabItem {
  name: TabName;
  label: string;
  icon: string;
  activeIcon: string;
}

const TABS: TabItem[] = [
  { name: 'home', label: '홈', icon: '🏠', activeIcon: '🏠' },
  { name: 'tracker', label: '증상', icon: '🩺', activeIcon: '🩺' },
  { name: 'map', label: '지도', icon: '📍', activeIcon: '📍' },
  { name: 'diet', label: '식단', icon: '🍽️', activeIcon: '🍽️' },
  { name: 'petid', label: 'ID', icon: '🏷️', activeIcon: '🏷️' },
];

const MOCK_PETS: Pet[] = [
  { id: '1', name: '뽀야', species: 'DOG', breed: '말티즈', photoUrl: null },
  { id: '2', name: '냥이', species: 'CAT', breed: '波斯猫', photoUrl: null },
];
const MOCK_TOKEN = 'mock-access-token';

const ScreenLoader = () => (
  <View style={styles.loader}>
    <Text style={styles.loaderText}>로딩중...</Text>
  </View>
);

const TabBar = ({ activeTab, onTabPress }: { activeTab: TabName; onTabPress: (tab: TabName) => void }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => (
      <TouchableOpacity
        key={tab.name}
        style={styles.tabItem}
        onPress={() => onTabPress(tab.name)}
      >
        <Text style={[styles.tabIcon, activeTab === tab.name && styles.tabIconActive]}>
          {activeTab === tab.name ? tab.activeIcon : tab.icon}
        </Text>
        <Text style={[styles.tabLabel, activeTab === tab.name && styles.tabLabelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<SymptomAnalysis[]>([]);

  useNavigationBar();

  useEffect(() => {
    if (screen === 'home' || screen === 'capture' || screen === 'result' || screen === 'history') {
      setActiveTab('home');
    } else if (['tracker', 'map', 'diet', 'petid'].includes(screen)) {
      setActiveTab(screen as TabName);
    }
  }, [screen]);

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    setScreen(tab);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setScreen('result');
  };

  const handleSaveToHistory = () => {
    if (analysisResult) {
      setHistory((prev) => [analysisResult as SymptomAnalysis, ...prev]);
    }
    setScreen('home');
  };

  const handleViewHistory = () => {
    setScreen('history');
  };

  const handleSymptomAnalyze = () => {
    setScreen('capture');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>VitalPaw</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Text style={styles.headerIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'home' && screen === 'home' && (
          <HomeDashboardScreen
            pets={MOCK_PETS}
            onNavigate={(s) => {
              if (s === 'symptom') {
                setActiveTab('tracker');
                setScreen('tracker');
              } else if (s === 'map') {
                setActiveTab('map');
                setScreen('map');
              } else if (s === 'diet') {
                setActiveTab('diet');
                setScreen('diet');
              } else if (s === 'petid') {
                setActiveTab('petid');
                setScreen('petid');
              }
            }}
          />
        )}

        {screen === 'capture' && (
          <SymptomCaptureScreen
            pets={MOCK_PETS}
            accessToken={MOCK_TOKEN}
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setScreen('home')}
          />
        )}

        {screen === 'result' && analysisResult && (
          <AnalysisResultScreen
            result={analysisResult}
            onSave={handleSaveToHistory}
            onBack={() => setScreen('capture')}
          />
        )}

        {screen === 'history' && (
          <SymptomHistoryScreen
            analyses={history}
            onBack={() => setScreen('home')}
            petId={MOCK_PETS[0]?.id}
            accessToken={MOCK_TOKEN}
            onLoadHistory={async (petId) => {
              try {
                const analyses = await getSymptomHistory(petId, MOCK_TOKEN);
                setHistory(analyses);
              } catch {
                setHistory([]);
              }
            }}
          />
        )}

        <Suspense fallback={<ScreenLoader />}>
          {activeTab === 'tracker' && screen === 'tracker' && (
            <SymptomTrackerScreen
              pets={MOCK_PETS}
              onAnalyze={handleSymptomAnalyze}
              onBack={() => {
                setActiveTab('home');
                setScreen('home');
              }}
            />
          )}

          {activeTab === 'map' && screen === 'map' && (
            <PetServiceMapScreen onBack={() => setScreen('map')} />
          )}

          {activeTab === 'diet' && screen === 'diet' && (
            <DietPlannerScreen onBack={() => setScreen('diet')} />
          )}

          {activeTab === 'petid' && screen === 'petid' && (
            <DigitalPetIDScreen pets={MOCK_PETS} onBack={() => setScreen('petid')} />
          )}
        </Suspense>
      </View>

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onBackground,
    letterSpacing: -0.5,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    ...theme.shadows.soft,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.tabInactive,
  },
  tabLabelActive: {
    color: theme.colors.tabActive,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 14,
    color: theme.colors.onSurfaceLight,
  },
});