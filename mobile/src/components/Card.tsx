import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, rounded } from '../design-system';
import { useTheme } from '../theme/ThemeContext';

type CardVariant = 'content' | 'feature-dark';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({ variant = 'content', style, children, ...props }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="none"
      style={[
        styles.base,
        variant === 'feature-dark' ? { backgroundColor: colors.ink } : { backgroundColor: colors.canvas, borderColor: colors.ink, borderWidth: 1 },
        style,
      ]}
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
});
