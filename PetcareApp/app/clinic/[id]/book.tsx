/**
 * Booking Screen
 * Phase 03-02: Booking System
 * Route: app/clinic/[id]/book.tsx
 */

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useClinic } from '../../contexts/ClinicContext';
import { BookingModal } from '../../components/clinic/BookingModal';
import { Booking } from '../../types/clinic.types';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    clinics, selectedClinic, bookings, fetchBookings, createBooking, cancelBooking 
  } = useClinic();
  const [showModal, setShowModal] = useState(false);
  
  const clinic = clinics.find(c => c.id === id) || selectedClinic;

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreateBooking = async (dateTime: Date) => {
    if (!clinic) return;
    // TODO: Get selected pet ID from PetContext
    const petId = 'selected-pet-id';
    const success = await createBooking(clinic.id, petId, dateTime);
    if (success) {
      setShowModal(false);
      Alert.alert('예약 완료', '예약이 확인되었습니다.');
    } else {
      Alert.alert('오류', '예약에 실패했습니다.');
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    Alert.alert(
      '예약 취소',
      '정말로 이 예약을 취소하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예, 취소합니다',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelBooking(booking.id);
            if (success) {
              Alert.alert('취소 완료', '예약이 취소되었습니다.');
            }
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const bookingDate = new Date(item.dateTime);
    const isPast = bookingDate < new Date();
    
    return (
      <View style={[styles.bookingCard, isPast && styles.bookingCardPast]}>
        <View style={styles.bookingHeader}>
          <Text style={styles.clinicName}>{item.clinicName}</Text>
          <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
            <Text style={styles.statusText}>
              {item.status === 'confirmed' ? '확정' : item.status === 'pending' ? '대기중' : '취소됨'}
            </Text>
          </View>
        </View>
        <Text style={styles.bookingDate}>
          {bookingDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Text>
        <Text style={styles.bookingTime}>
          {bookingDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {!isPast && item.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(item)}
          >
            <Text style={styles.cancelButtonText}>예약 취소</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!clinic) {
    return (
      <View style={styles.centered}>
        <Text>Clinic not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* New Booking Section */}
      <TouchableOpacity style={styles.newBookingCard} onPress={() => setShowModal(true)}>
        <Text style={styles.newBookingIcon}>📅</Text>
        <Text style={styles.newBookingText}>새 예약하기</Text>
        <Text style={styles.newBookingArrow}>→</Text>
      </TouchableOpacity>

      {/* Booking History */}
      <Text style={styles.sectionTitle}>예약 내역</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>예약 내역이 없습니다</Text>
        }
      />

      {/* Booking Modal */}
      <BookingModal
        visible={showModal}
        clinic={clinic}
        onClose={() => setShowModal(false)}
        onConfirm={handleCreateBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  newBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  newBookingIcon: { fontSize: 24, marginRight: 12 },
  newBookingText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600' },
  newBookingArrow: { color: '#fff', fontSize: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginHorizontal: 16, marginTop: 8, marginBottom: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingCardPast: { opacity: 0.6 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clinicName: { fontSize: 16, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  status_confirmed: { backgroundColor: '#E8F5E9' },
  status_pending: { backgroundColor: '#FFF3E0' },
  status_cancelled: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '500' },
  bookingDate: { fontSize: 16, marginBottom: 4 },
  bookingTime: { fontSize: 14, color: '#666' },
  cancelButton: { marginTop: 12, alignSelf: 'flex-end' },
  cancelButtonText: { color: '#FF3B30', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
});
