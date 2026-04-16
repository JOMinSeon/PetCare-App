import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const componentStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primaryButtonGradient: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden' as const,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  cardElevated: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.petSoft,
  },
  cardInteractive: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  healthCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  inputField: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFieldFocused: {
    borderColor: theme.colors.ghostBorder,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  chip: {
    backgroundColor: theme.colors.secondaryFixed,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  chipSelected: {
    backgroundColor: theme.colors.secondary,
  },
  glassNav: {
    backgroundColor: `rgba(255, 255, 255, ${theme.glassmorphism.opacity})`,
    backdropFilter: `blur(${theme.glassmorphism.blur}px)`,
  },
  divider: {
    height: 0,
    backgroundColor: 'transparent',
  },
});
