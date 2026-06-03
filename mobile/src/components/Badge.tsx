import { View, Text, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';

type BadgeVariant = 'positive' | 'negative';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({
  label,
  variant = 'positive',
  accessibilityLabel,
  style,
  ...props
}: BadgeProps) {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      style={[styles.base, variant === 'negative' ? styles.negative : styles.positive, style]}
      {...props}
    >
      <Text
        style={[styles.text, variant === 'negative' ? styles.textNegative : styles.textPositive]}
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rounded.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  positive: {
    backgroundColor: colors.primary,
  },
  negative: {
    backgroundColor: colors.ink,
  },
  text: {
    ...typography['body-sm-strong'],
  },
  textPositive: {
    color: colors.ink,
  },
  textNegative: {
    color: colors.canvas,
  },
});
