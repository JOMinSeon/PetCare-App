/**
 * StarRating Component
 * Phase 03-03: Review System
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const STAR_COLOR = '#FFD700';
const EMPTY_COLOR = '#DDD';

// Input variant - tappable stars
export function StarRatingInput({ rating, onRatingChange, size = 40 }: StarRatingInputProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          activeOpacity={0.7}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Display variant - shows rating without interaction
export function StarRatingDisplay({ rating, size = 16, showValue = true }: StarRatingDisplayProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <View style={styles.displayContainer}>
      <Text style={[styles.displayStars, { fontSize: size }]}>
        {'★'.repeat(fullStars)}
        {hasHalfStar ? '½' : ''}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </Text>
      {showValue && (
        <Text style={[styles.ratingValue, { fontSize: size * 0.8 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  star: {
    color: STAR_COLOR,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayStars: {
    color: STAR_COLOR,
  },
  ratingValue: {
    fontWeight: '600',
    color: '#333',
  },
});

export default { StarRatingInput, StarRatingDisplay };