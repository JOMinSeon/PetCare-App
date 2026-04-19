import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../components';
import { COLORS, SPACING } from '../utils/constants';

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>마이 페이지</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
          <Text style={styles.userName}>사용자</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        <Text style={styles.sectionTitle}>반려동물 관리</Text>
        <Card>
          <View style={styles.petRow}>
            <Text style={styles.petIcon}>🐕</Text>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>댕댕이</Text>
              <Text style={styles.petBreed}>포메라니안</Text>
            </View>
            <Button title="편집" variant="secondary" onPress={() => {}} />
          </View>
        </Card>
        <Button title="반려동물 추가" variant="primary" onPress={() => {}} style={styles.addBtn} />

        <Text style={styles.sectionTitle}>설정</Text>
        <Card title="계정 설정" style={styles.menuCard}><Text style={styles.menuArrow}>›</Text></Card>
        <Card title="알림 설정" style={styles.menuCard}><Text style={styles.menuArrow}>›</Text></Card>
        <Card title="결제 기록" style={styles.menuCard}><Text style={styles.menuArrow}>›</Text></Card>
        <Card title="고객 지원" style={styles.menuCard}><Text style={styles.menuArrow}>›</Text></Card>

        <Button title="로그아웃" variant="secondary" onPress={() => {}} style={styles.logoutBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, padding: SPACING.lg },
  profileSection: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36 },
  userName: { fontSize: 20, fontWeight: '600', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  petRow: { flexDirection: 'row', alignItems: 'center' },
  petIcon: { fontSize: 32, marginRight: 12 },
  petInfo: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  petBreed: { fontSize: 14, color: COLORS.textSecondary },
  addBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.sm },
  menuCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuArrow: { fontSize: 24, color: COLORS.textLight },
  logoutBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
