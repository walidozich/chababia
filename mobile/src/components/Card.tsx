import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, rounded, spacing } from '../design-system';

type CardVariant = 'content' | 'featureSage' | 'featureGreen' | 'featureDark';

type CardProps = ViewProps & {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  variant = 'content',
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      style={[styles.base, stylesByVariant[variant], style]}
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

const stylesByVariant: Record<CardVariant, ViewStyle> = {
  content: { backgroundColor: colors.canvas },
  featureSage: { backgroundColor: colors.canvasSoft },
  featureGreen: { backgroundColor: colors.primaryPale },
  featureDark: { backgroundColor: colors.ink },
};
