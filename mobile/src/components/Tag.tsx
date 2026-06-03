import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';

type TagVariant = 'solid' | 'soft' | 'outline';

interface TagProps {
  label: string;
  variant?: TagVariant;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function Tag({
  label,
  variant = 'soft',
  accessibilityLabel,
  style,
}: TagProps) {
  const textStyle = variant === 'solid' ? styles.solidText : variant === 'outline' ? styles.outlineText : styles.softText;
  const containerStyle = variant === 'solid' ? styles.solid : variant === 'outline' ? styles.outline : styles.soft;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      style={[styles.base, containerStyle, style]}
    >
      <Text style={[styles.text, textStyle]} maxFontSizeMultiplier={1.3} numberOfLines={1}>
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
  solid: {
    backgroundColor: colors.primary,
  },
  soft: {
    backgroundColor: 'rgba(232, 235, 230, 0.92)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ink,
  },
  text: {
    ...typography['body-sm-strong'],
    color: colors.ink,
  },
  solidText: {
    color: colors.ink,
  },
  softText: {
    color: colors.body,
  },
  outlineText: {
    color: colors.ink,
  },
});
