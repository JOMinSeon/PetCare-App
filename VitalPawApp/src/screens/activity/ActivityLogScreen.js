import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useHealthStore, usePetStore } from '../../store';
import { ActivityLogCard, LoadingSpinner, EmptyState, Button } from '../../components';

export default function ActivityLogScreen({ navigation }) {
  const { activityLogs, fetchActivityLogs, isLoading } = useHealthStore();
  const { selectedPet, pets } = usePetStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedPet) fetchActivityLogs(selectedPet.id);
    else if (pets.length > 0) fetchActivityLogs(pets[0].id);
  }, [selectedPet]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedPet) await fetchActivityLogs(selectedPet.id);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Log</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddActivityLog')}>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {activityLogs.length === 0 ? (
        <EmptyState message="No activities logged yet" icon="🏃">
          <Button title="Log Activity" onPress={() => navigation.navigate('AddActivityLog')} size="small" />
        </EmptyState>
      ) : (
        <FlatList
          data={activityLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ActivityLogCard log={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: { fontSize: 20, fontWeight: '600', color: '#1C1C1E' },
  addButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  listContent: { padding: 16 },
});