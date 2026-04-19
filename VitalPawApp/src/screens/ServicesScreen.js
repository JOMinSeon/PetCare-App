import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../components';
import { COLORS, SPACING } from '../utils/constants';

export function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>서비스</Text>

        <Text style={styles.sectionTitle}>🐾 제휴 서비스</Text>
        <Card title="병원 예약">
          <Text style={styles.cardText}>근처 동물병원을 검색하고 예약을 진행하세요.</Text>
          <Button title="병원 찾기" onPress={() => {}} />
        </Card>

        <Card title="건강 상담">
          <Text style={styles.cardText}>반려동물 건강 관련 전문가 상담 서비스를 이용하세요.</Text>
          <Button title="상담 신청" variant="secondary" onPress={() => {}} />
        </Card>

        <Card title="사료/용품 쇼핑">
          <Text style={styles.cardText}>추천 사료와 건강 용품을 확인하세요.</Text>
          <Button title="쇼핑하기" variant="accent" onPress={() => {}} />
        </Card>

        <Text style={styles.sectionTitle}>📢 커뮤니티</Text>
        <Card title="반려동물 이야기">
          <Text style={styles.cardText}>다른 보호자들과 정보를 공유하세요.</Text>
          <Button title="게시판 이동" variant="secondary" onPress={() => {}} />
        </Card>

        <Card title="건강 가이드">
          <Text style={styles.cardText}>반려동물 건강 관리 팁을 확인하세요.</Text>
          <Button title="가이드 보기" variant="secondary" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginHorizontal: SPACING.lg, marginTop: SPACING.md, marginBottom: SPACING.sm },
  cardText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
});
