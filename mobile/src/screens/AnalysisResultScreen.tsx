import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AnalysisResult } from '../types';
import { theme } from '../theme';

interface Props {
  result: AnalysisResult;
  onSave: () => void;
  onBack: () => void;
}

const URGENCY_CONFIG = {
  GREEN: { color: theme.colors.success, label: '낮은 긴급성', bg: '#E8F4EF' },
  YELLOW: { color: theme.colors.warning, label: '중간 긴급성', bg: '#FEF3E8' },
  RED: { color: theme.colors.danger, label: '높은 긴급성', bg: '#FFEBEE' },
};

export default React.memo(function AnalysisResultScreen({ result, onSave, onBack }: Props) {
  const urgency = URGENCY_CONFIG[result.urgencyLevel];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>분석 결과</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.urgencyCard, { backgroundColor: urgency.bg }]}>
          <View style={[styles.urgencyBadge, { backgroundColor: urgency.color }]}>
            <Text style={styles.urgencyText}>{urgency.label}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>감지된 증상</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result.symptoms}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>권장 조치</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result.recommendation}</Text>
          </View>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>면책 안내</Text>
          <Text style={styles.disclaimerText}>{result.disclaimer}</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>기록에 저장</Text>
        </TouchableOpacity>
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
  urgencyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  urgencyBadge: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
  },
  urgencyText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.onSurface, marginBottom: theme.spacing.md },
  resultCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  resultText: { fontSize: 15, lineHeight: 24, color: theme.colors.onSurface },
  disclaimerBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.soft,
  },
  disclaimerTitle: { fontSize: 12, fontWeight: '600', color: theme.colors.onSurfaceLight, marginBottom: theme.spacing.sm },
  disclaimerText: { fontSize: 12, color: theme.colors.onSurfaceLight, lineHeight: 18 },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});