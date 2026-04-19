import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Diet } from '../services/diet.service';

interface DietCardProps {
  diet: Diet;
  onPress?: () => void;
}

export const DietCard: React.FC<DietCardProps> = ({ diet }) => {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>🍽️</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.foodName}>{diet.foodName}</Text>
        <Text style={styles.details}>{diet.amountGrams}g • {diet.calories} kcal</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>P: {diet.protein}g</Text>
          <Text style={styles.macro}>F: {diet.fat}g</Text>
          <Text style={styles.macro}>C: {diet.carbs}g</Text>
        </View>
        <Text style={styles.date}>{new Date(diet.date).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  macros: {
    flexDirection: 'row',
    marginTop: 6,
  },
  macro: {
    fontSize: 12,
    color: '#888',
    marginRight: 12,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});