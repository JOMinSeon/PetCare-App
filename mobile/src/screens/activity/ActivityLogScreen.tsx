import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useActivityStore } from '../../stores/activityStore';
import { ActivityCard } from '../../components/ActivityCard';

type ParamList = {
  ActivityLog: { petId: string };
};

export const ActivityLogScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'ActivityLog'>>();
  const { petId } = route.params;
  const { activities, createActivity, fetchActivities, isLoading } = useActivityStore();

  const [steps, setSteps] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchActivities(petId, 1);
  }, [petId]);

  const handleSubmit = async () => {
    if (!durationMinutes) {
      Alert.alert('Error', 'Please enter activity duration');
      return;
    }

    try {
      await createActivity(petId, {
        steps: steps ? parseInt(steps) : undefined,
        durationMinutes: parseInt(durationMinutes),
        date: new Date(date).toISOString(),
      });
      setSteps('');
      setDurationMinutes('');
      Alert.alert('Success', 'Activity logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity');
    }
  };

  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.date).toISOString().split('T')[0];
    return activityDate === new Date().toISOString().split('T')[0];
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="Enter duration in minutes"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Steps (optional)</Text>
        <TextInput
          style={styles.input}
          value={steps}
          onChangeText={setSteps}
          placeholder="Enter step count"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.submitButtonText}>Log Activity</Text>
        </TouchableOpacity>
      </View>

      {todayActivities.length > 0 && (
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>
          {todayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#00897B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  todaySection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
});