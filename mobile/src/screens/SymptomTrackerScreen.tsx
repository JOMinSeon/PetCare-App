import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Pet } from '../types';
import { theme } from '../theme';

interface Props {
  pets: Pet[];
  onAnalyze: (symptoms: string[]) => void;
  onBack: () => void;
}

const SYMPTOM_OPTIONS = [
  { id: 'vomit', label: '구토', icon: '🤮' },
  { id: 'diarrhea', label: '설사', icon: '💧' },
  { id: 'lethargy', label: '무기력', icon: '😴' },
  { id: 'cough', label: '기침', icon: '🤧' },
  { id: 'fever', label: '발열', icon: '🌡️' },
  { id: 'loss_appetite', label: '식욕 부진', icon: '🍽️' },
  { id: 'scratch', label: '긁기/물기', icon: '✋' },
  { id: 'breathing', label: '호흡 이상', icon: '😮' },
];

export default React.memo(function SymptomTrackerScreen({ pets, onAnalyze, onBack }: Props) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSymptom = useCallback((id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selectedSymptoms.length === 0) return;
    onAnalyze(selectedSymptoms);
  }, [selectedSymptoms, onAnalyze]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>증상 기록</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>반려동물</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petList}>
          {pets.map((pet) => {
            const isSelected = selectedPet?.id === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petItem, isSelected && styles.petItemSelected]}
                onPress={() => setSelectedPet(pet)}
              >
                <View style={[styles.petAvatar, isSelected && styles.petAvatarSelected]}>
                  <Text style={styles.petEmoji}>{pet.species === 'DOG' ? '🐕' : '🐱'}</Text>
                </View>
                <Text style={[styles.petName, isSelected && styles.petNameSelected]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>증상 선택</Text>
        <View style={styles.symptomGrid}>
          {SYMPTOM_OPTIONS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[styles.symptomItem, isSelected && styles.symptomItemSelected]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                <Text style={[styles.symptomLabel, isSelected && styles.symptomLabelSelected]}>
                  {symptom.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>메모</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="추가 증상을 입력하세요..."
          placeholderTextColor={theme.colors.onSurfaceLight}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.analyzeButton, selectedSymptoms.length === 0 && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={selectedSymptoms.length === 0}
        >
          <Text style={styles.analyzeButtonText}>AI 분석 요청하기</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            본 분석은 참고용으로, 전문 수의사 진단을 대체할 수 없습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: { padding: theme.spacing.xs },
  backText: { fontSize: 20, color: theme.colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.onBackground },
  headerSpacer: { width: 40 },
  content: { flex: 1, padding: theme.spacing.lg },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  petList: { flexDirection: 'row', marginBottom: theme.spacing.md },
  petItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  petItemSelected: {},
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  petAvatarSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  petEmoji: {
    fontSize: 26,
  },
  petName: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  petNameSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  symptomItemSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  symptomIcon: {
    fontSize: 14,
    marginRight: theme.spacing.xs,
  },
  symptomLabel: {
    fontSize: 13,
    color: theme.colors.onSurface,
  },
  symptomLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.onSurface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  analyzeButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  disclaimerText: {
    color: theme.colors.onSurfaceLight,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});