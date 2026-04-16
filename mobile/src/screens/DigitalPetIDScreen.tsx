import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Pet } from '../types';
import { theme } from '../theme';

interface Props {
  pets: Pet[];
  onBack: () => void;
}

const MEDICAL_RECORDS = [
  { icon: '💉', title: '종합 예방접종', date: '2026.03.15', status: '완료' },
  { icon: '🩺', title: '정기 건강 검진', date: '2026.02.20', status: '정상' },
  { icon: '🦷', title: '구강 관리', date: '2026.01.10', status: '완료' },
];

const EMERGENCY_CONTACTS = [
  { icon: '👤', label: '보호자', value: '홍길동 010-1234-5678' },
  { icon: '🩺', label: '주치의', value: '사랑 동물병원 02-1234-5678' },
];

export default React.memo(function DigitalPetIDScreen({ pets, onBack }: Props) {
  const pet = pets[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>펫 신분증</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.idCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>VitalPaw ID</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>📱</Text>
            </View>
          </View>

          <View style={styles.petProfile}>
            <View style={styles.petAvatarLarge}>
              <Text style={styles.petAvatarEmoji}>{pet?.species === 'DOG' ? '🐕' : '🐱'}</Text>
            </View>
            <View style={styles.petDetails}>
              <Text style={styles.petName}>{pet?.name || '뽀야'}</Text>
              <Text style={styles.petBreed}>{pet?.breed || '말티즈'}</Text>
              <View style={styles.petTag}>
                <Text style={styles.petTagText}>{pet?.species === 'DOG' ? '강아지' : '고양이'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>나이</Text>
              <Text style={styles.infoValue}>3세</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>몸무게</Text>
              <Text style={styles.infoValue}>4.2kg</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>성별</Text>
              <Text style={styles.infoValue}>수컷</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>중성화</Text>
              <Text style={styles.infoValue}>여부</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>의료 이력</Text>
          {MEDICAL_RECORDS.map((record) => (
            <View key={record.title} style={styles.medicalItem}>
              <Text style={styles.medicalIcon}>{record.icon}</Text>
              <View style={styles.medicalInfo}>
                <Text style={styles.medicalTitle}>{record.title}</Text>
                <Text style={styles.medicalDate}>{record.date}</Text>
              </View>
              <Text style={styles.medicalStatus}>{record.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>긴급 연락처</Text>
          {EMERGENCY_CONTACTS.map((contact) => (
            <View key={contact.label} style={styles.contactItem}>
              <Text style={styles.contactIcon}>{contact.icon}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={styles.contactValue}>{contact.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            분실 시 이 카드를 보여주시면 보호자에게 연락됩니다.
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
  idCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  cardTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },
  qrPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: { fontSize: 22 },
  petProfile: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  petAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  petAvatarEmoji: { fontSize: 36 },
  petDetails: { flex: 1 },
  petName: { fontSize: 22, fontWeight: '700', color: theme.colors.onSurface },
  petBreed: { fontSize: 14, color: theme.colors.onSurfaceLight, marginTop: 2 },
  petTag: { backgroundColor: theme.colors.background, paddingVertical: 4, paddingHorizontal: 10, borderRadius: theme.borderRadius.full, alignSelf: 'flex-start', marginTop: theme.spacing.sm },
  petTagText: { fontSize: 11, fontWeight: '500', color: theme.colors.onSurfaceLight },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  infoItem: { width: '50%', paddingVertical: theme.spacing.sm },
  infoLabel: { fontSize: 11, color: theme.colors.onSurfaceLight, textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { fontSize: 15, fontWeight: '600', color: theme.colors.onSurface, marginTop: 2 },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.onSurface, marginBottom: theme.spacing.md },
  medicalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  medicalIcon: { fontSize: 18, marginRight: theme.spacing.md },
  medicalInfo: { flex: 1 },
  medicalTitle: { fontSize: 14, color: theme.colors.onSurface },
  medicalDate: { fontSize: 12, color: theme.colors.onSurfaceLight, marginTop: 2 },
  medicalStatus: { fontSize: 12, fontWeight: '600', color: theme.colors.success },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm },
  contactIcon: { fontSize: 18, marginRight: theme.spacing.md },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 11, color: theme.colors.onSurfaceLight, textTransform: 'uppercase', letterSpacing: 1 },
  contactValue: { fontSize: 14, color: theme.colors.onSurface, marginTop: 2 },
  disclaimer: { padding: theme.spacing.md, alignItems: 'center' },
  disclaimerText: { fontSize: 12, color: theme.colors.onSurfaceLight, textAlign: 'center' },
});