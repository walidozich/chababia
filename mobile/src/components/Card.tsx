import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, rounded } from '../design-system';

type CardVariant = 'content' | 'feature-dark';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({ variant = 'content', style, children, ...props }: CardProps) {
  return (
    <View
      accessibilityRole="none"
      style={[styles.base, variant === 'feature-dark' ? styles.featureDark : styles.content, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rounded.xl,
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  featureDark: {
    backgroundColor: colors.ink,
  },
});
