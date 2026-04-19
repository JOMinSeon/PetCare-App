import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export function Button({ title, onPress, variant = 'primary', disabled }) {
  const bgColor = variant === 'primary' ? COLORS.primary :
                  variant === 'secondary' ? COLORS.backgroundSecondary : COLORS.accent;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, variant === 'secondary' && { color: COLORS.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  text: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
