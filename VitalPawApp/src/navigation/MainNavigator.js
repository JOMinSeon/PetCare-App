import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PetListScreen from '../screens/pets/PetListScreen';
import PetDetailScreen from '../screens/pets/PetDetailScreen';
import AddPetScreen from '../screens/pets/AddPetScreen';
import HealthMetricsScreen from '../screens/health/HealthMetricsScreen';
import AddHealthMetricScreen from '../screens/health/AddHealthMetricScreen';
import DietLogScreen from '../screens/diet/DietLogScreen';
import AddDietLogScreen from '../screens/diet/AddDietLogScreen';
import ActivityLogScreen from '../screens/activity/ActivityLogScreen';
import AddActivityLogScreen from '../screens/activity/AddActivityLogScreen';
import ReminderScreen from '../screens/reminders/ReminderScreen';
import AddReminderScreen from '../screens/reminders/AddReminderScreen';
import CommunityScreen from '../screens/community/CommunityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Home: '🏠',
    Pets: '🐾',
    Health: '❤️',
    Community: '💬',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabIconText}>{icons[name] || '📌'}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: '#1C1C1E', fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Pets" component={PetStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Health" component={HealthStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Community' }} />
    </Tab.Navigator>
  );
}

function PetStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PetList" component={PetListScreen} options={{ title: 'My Pets' }} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} options={{ title: 'Pet Details' }} />
      <Stack.Screen name="AddPet" component={AddPetScreen} options={{ title: 'Add Pet' }} />
    </Stack.Navigator>
  );
}

function HealthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HealthMetrics" component={HealthMetricsScreen} options={{ title: 'Health' }} />
      <Stack.Screen name="AddHealthMetric" component={AddHealthMetricScreen} options={{ title: 'Add Metric' }} />
      <Stack.Screen name="DietLog" component={DietLogScreen} options={{ title: 'Diet Log' }} />
      <Stack.Screen name="AddDietLog" component={AddDietLogScreen} options={{ title: 'Add Diet' }} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} options={{ title: 'Activity Log' }} />
      <Stack.Screen name="AddActivityLog" component={AddActivityLogScreen} options={{ title: 'Add Activity' }} />
      <Stack.Screen name="Reminders" component={ReminderScreen} options={{ title: 'Reminders' }} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'Add Reminder' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} options={{ headerShown: true }} />
      <Stack.Screen name="AddPet" component={AddPetScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 24,
  },
});