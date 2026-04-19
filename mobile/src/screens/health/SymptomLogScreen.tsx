import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSymptomStore } from '../../stores/symptomStore';
import { RiskAlert } from '../../components/RiskAlert';

type ParamList = {
  SymptomLog: { petId: string };
};

export const SymptomLogScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'SymptomLog'>>();
  const { petId } = route.params;
  const { createSymptom, lastAnalysis, isLoading, clearSymptoms } = useSymptomStore();

  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a symptom description');
      return;
    }

    try {
      const analysis = await createSymptom(petId, {
        description: description.trim(),
        severity,
        date: new Date(date).toISOString(),
      });

      Alert.alert(
        analysis.riskLevel === 'high' ? 'High Risk Alert' : 'Symptom Logged',
        analysis.recommendation,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log symptom. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the symptom..."
          multiline
          maxLength={500}
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
              <Text
                style={[
                  styles.severityText,
                  severity === level && styles.severityTextSelected,
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.textInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Log Symptom</Text>
          )}
        </TouchableOpacity>

        {lastAnalysis && (
          <View style={styles.analysisSection}>
            <RiskAlert
              riskScore={lastAnalysis.riskScore}
              riskLevel={lastAnalysis.riskLevel}
              recommendation={lastAnalysis.recommendation}
            />
            <Text style={styles.disclaimer}>{lastAnalysis.disclaimer}</Text>
          </View>
        )}
      </View>
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
    marginBottom: 16,
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
  submitButton: {
    backgroundColor: '#00897B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  analysisSection: {
    marginTop: 24,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});