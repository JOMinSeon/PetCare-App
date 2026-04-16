/**
 * ReviewWriteScreen
 * Phase 03-03: Review System
 * app/clinic/[id]/review.tsx
 */

import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useClinic } from '../../src/contexts/ClinicContext';
import { StarRatingInput } from '../../src/components/clinic/StarRating';
import { submitReview } from '../../src/services/clinic.service';

export default function ReviewWriteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clinics, selectedClinic } = useClinic();
  const router = useRouter();

  const clinic = clinics.find(c => c.id === id) || selectedClinic;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('평점을 선택해주세요', '병원을 평가해주세요.');
      return;
    }
    if (reviewText.trim().length < 10) {
      Alert.alert('리뷰를 입력해주세요', '최소 10자 이상의 리뷰를 작성해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitReview(id as string, {
        rating: rating as 1 | 2 | 3 | 4 | 5,
        text: reviewText.trim(),
      });

      if (result.success) {
        Alert.alert('리뷰 작성 완료', '소중한 리뷰를 작성해 주셔서 감사합니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('오류', result.error || '리뷰 작성에 실패했습니다.');
      }
    } catch {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!clinic) {
    return (
      <View style={styles.centered}>
        <Text>Clinic not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Clinic Info */}
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>{clinic.name}</Text>
          <Text style={styles.clinicAddress}>{clinic.roadAddress}</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>평점</Text>
          <Text style={styles.ratingHint}>어떤 경험을 하셨나요?</Text>
          <StarRatingInput rating={rating} onRatingChange={setRating} size={48} />
          <Text style={styles.ratingText}>
            {rating === 0 && '선택하세요'}
            {rating === 1 && '매우 불만족'}
            {rating === 2 && '불만족'}
            {rating === 3 && '보통'}
            {rating === 4 && '만족'}
            {rating === 5 && '매우 만족'}
          </Text>
        </View>

        {/* Review Text Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          <TextInput
            style={styles.textInput}
            placeholder="병원 이용 경험을 공유해 주세요..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={reviewText}
            onChangeText={setReviewText}
            maxLength={500}
          />
          <Text style={styles.charCount}>{reviewText.length}/500</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? '제출 중...' : '리뷰 제출'}
          </Text>
        </TouchableOpacity>

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Text style={styles.guidelineTitle}>리뷰 작성 안내</Text>
          <Text style={styles.guidelineText}>
            • 실제 이용 경험을 기반으로 작성해주세요{'\n'}
            • 개인정보나 주민등록번호 등 보안에 민감한 정보는 포함하지 마세요{'\n'}
            • 특정인을 비방하거나 名誉毀損 내용이 포함된 리뷰는 임의 삭제될 수 있습니다
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  clinicInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  clinicName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  clinicAddress: { fontSize: 14, color: '#666' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  ratingHint: { fontSize: 14, color: '#666', marginBottom: 12, textAlign: 'center' },
  ratingText: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center' },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    color: '#333',
  },
  charCount: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 4 },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: { backgroundColor: '#ccc' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  guidelines: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  guidelineTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  guidelineText: { fontSize: 12, color: '#666', lineHeight: 20 },
});