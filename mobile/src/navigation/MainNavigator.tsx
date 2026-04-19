import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { PetListScreen } from '../screens/pets/PetListScreen';
import { PetDetailScreen } from '../screens/pets/PetDetailScreen';
import { AddPetScreen } from '../screens/pets/AddPetScreen';
import { EditPetScreen } from '../screens/pets/EditPetScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ServicesMapScreen } from '../screens/map/ServicesMapScreen';

function SettingsScreen(): JSX.Element {
  const { logout } = useAuth();

  return (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Settings</Text>
      <Text style={styles.placeholderText}>
        Settings will be implemented in later phases.
      </Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PetsStack(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00897B' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="PetList"
        component={PetListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
        options={{ title: 'Pet Profile' }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: 'Add Pet' }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ title: 'Edit Pet' }}
      />
    </Stack.Navigator>
  );
}

export type MainTabParamList = {
  DashboardTab: undefined;
  PetsTab: undefined;
  MapTab: undefined;
  SettingsTab: undefined;
};

function TabIcon({ name, focused }: { name: string; focused: boolean }): JSX.Element {
  const icons: Record<string, string> = {
    Dashboard: '🏠',
    Pets: '🐾',
    Map: '🗺️',
    Settings: '⚙️',
  };
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[name] || '•'}
    </Text>
  );
}

export function MainNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name.replace('Tab', '')} focused={focused} />,
        tabBarActiveTintColor: '#008B8B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="PetsTab"
        component={PetsStack}
        options={{ tabBarLabel: 'Pets' }}
      />
      <Tab.Screen
        name="MapTab"
        component={ServicesMapScreen}
        options={{ tabBarLabel: 'Services' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008B8B',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});

export default MainNavigator;
