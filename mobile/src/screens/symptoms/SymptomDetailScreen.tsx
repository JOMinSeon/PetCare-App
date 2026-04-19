import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSymptomStore } from '../../stores/symptomStore';
import { RiskAlert } from '../../components/RiskAlert';

type ParamList = {
  SymptomDetail: { petId: string; symptomId: string };
};

export const SymptomDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'SymptomDetail'>>();
  const { petId, symptomId } = route.params;
  const { symptoms, updateSymptom, deleteSymptom, setCurrentSymptom } = useSymptomStore();

  const symptom = symptoms.find((s) => s.id === symptomId);

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(symptom?.description || '');
  const [severity, setSeverity] = useState(symptom?.severity || 'mild');

  useEffect(() => {
    if (symptom) {
      setCurrentSymptom(symptom);
    }
    return () => setCurrentSymptom(null);
  }, [symptom]);

  const handleSave = async () => {
    try {
      await updateSymptom(petId, symptomId, { description, severity });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update symptom');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Symptom',
      'Are you sure you want to delete this symptom?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSymptom(petId, symptomId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete symptom');
            }
          },
        },
      ]
    );
  };

  if (!symptom) {
    return (
      <View style={styles.container}>
        <Text>Symptom not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {isEditing ? (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Severity</Text>
            <View style={styles.severityRow}>
              {(['mild', 'moderate', 'severe'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    severity === level && styles.severitySelected,
                  ]}
                  onPress={() => setSeverity(level)}
                >
                  <Text style={severity === level ? styles.severityTextSelected : styles.severityText}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.severityBadge}>
              <Text style={[styles.severityBadgeText, { backgroundColor: getSeverityColor(symptom.severity) }]}>
                {symptom.severity.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.description}>{symptom.description}</Text>
            <Text style={styles.date}>{new Date(symptom.date).toLocaleString()}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild': return '#4CAF50';
    case 'moderate': return '#FFC107';
    case 'severe': return '#F44336';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  severityRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  severitySelected: {
    backgroundColor: '#00897B',
    borderColor: '#00897B',
  },
  severityText: {
    fontSize: 14,
    color: '#333',
  },
  severityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#00897B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00897B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  severityBadge: {
    marginBottom: 16,
  },
  severityBadgeText: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  description: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});