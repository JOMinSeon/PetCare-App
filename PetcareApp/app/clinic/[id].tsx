/**
 * ClinicDetailScreen
 * Phase 03-01: Clinic Search & Map
 * Phase 03-03: Added reviews section
 * app/clinic/[id].tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useClinic } from '../../src/contexts/ClinicContext';
import { StarRatingDisplay } from '../../src/components/clinic/StarRating';
import { getClinicReviews } from '../../src/services/clinic.service';
import { Review } from '../../src/types/clinic.types';

export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clinics, selectedClinic, selectClinic } = useClinic();
  const router = useRouter();

  const [clinicReviews, setClinicReviews] = useState<Review[]>([]);

  const clinic = clinics.find(c => c.id === id) || selectedClinic;

  useEffect(() => {
    if (clinic?.id) {
      (async () => {
        const result = await getClinicReviews(clinic.id);
        if (result.success && result.data) {
          setClinicReviews(result.data);
        }
      })();
    }
  }, [clinic?.id]);

  if (!clinic) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>병원을 찾을 수 없습니다</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = () => {
    if (clinic.phone) {
      Linking.openURL(`tel:${clinic.phone}`).catch(() => {
        Alert.alert('오류', '전화 걸기 실패');
      });
    }
  };

  const handleBooking = () => {
    selectClinic(clinic);
    router.push(`/clinic/${clinic.id}/book`);
  };

  const handleReview = () => {
    selectClinic(clinic);
    router.push(`/clinic/${clinic.id}/review`);
  };

  const handleMap = () => {
    if (clinic.latitude && clinic.longitude) {
      const url = `https://map.kakao.com/link/map/${clinic.latitude},${clinic.longitude}`;
      Linking.openURL(url).catch(() => {
        const searchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clinic.name)}`;
        Linking.openURL(searchUrl);
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.name}>{clinic.name}</Text>
        {clinic.rating !== undefined && (
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★★★★★</Text>
            <Text style={styles.ratingText}>{clinic.rating.toFixed(1)}</Text>
            {clinic.reviewCount !== undefined && (
              <Text style={styles.reviewCount}>({clinic.reviewCount} 리뷰)</Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.section} onPress={handleMap}>
        <Text style={styles.sectionTitle}>주소</Text>
        <Text style={styles.address}>{clinic.roadAddress}</Text>
        <Text style={styles.addressOld}>{clinic.address}</Text>
        <Text style={styles.mapLink}>지도 보기 →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={handleCall}>
        <Text style={styles.sectionTitle}>전화</Text>
        <Text style={styles.phone}>{clinic.phone}</Text>
        <Text style={styles.callLink}>전화 걸기 →</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>운영 시간</Text>
        <Text style={styles.hours}>{clinic.operatingHours}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>예약하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
          <Text style={styles.reviewButtonText}>리뷰 작성</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsSectionHeader}>
          <Text style={styles.reviewsSectionTitle}>리뷰</Text>
          <TouchableOpacity onPress={handleReview}>
            <Text style={styles.writeReviewLink}>리뷰 작성</Text>
          </TouchableOpacity>
        </View>

        {clinicReviews.length > 0 ? (
          clinicReviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <StarRatingDisplay rating={review.rating} size={14} showValue={false} />
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString('ko-KR')}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>아직 리뷰가 없습니다. 첫 리뷰를 작성해 주세요!</Text>
        )}

        {clinicReviews.length > 3 && (
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>모든 리뷰 보기 ({clinicReviews.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  notFoundText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  address: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  addressOld: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  mapLink: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
  phone: {
    fontSize: 16,
    color: '#333333',
  },
  callLink: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
  hours: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  actions: {
    padding: 20,
    flexDirection: 'row',
    gap: 12,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  reviewButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  reviewsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reviewsSectionTitle: { fontSize: 18, fontWeight: '600' },
  writeReviewLink: { color: '#007AFF', fontSize: 14 },
  reviewCard: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewerName: { fontSize: 14, fontWeight: '500' },
  reviewText: { fontSize: 14, color: '#333', lineHeight: 20 },
  reviewDate: { fontSize: 12, color: '#888', marginTop: 8 },
  noReviews: { textAlign: 'center', color: '#888', paddingVertical: 20 },
  viewAllButton: { alignItems: 'center', paddingVertical: 12 },
  viewAllText: { color: '#007AFF', fontSize: 14 },
});
