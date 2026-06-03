import { View, Text, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { typography, spacing, colors } from '../design-system';

interface SectionHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  subtitle,
  accessibilityLabel,
  style,
  ...props
}: SectionHeaderProps) {
  return (
    <View
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, style]}
      {...props}
    >
      <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.3} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography['display-sm'],
    color: colors.ink,
  },
  subtitle: {
    ...typography['body-lg'],
    color: colors.ink,
    marginTop: spacing.sm,
  },
});
