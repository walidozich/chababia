import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon-circular';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = 'primary',
  accessibilityLabel,
  style,
  ...props
}: ButtonProps) {
  const isInverse = variant === 'secondary';
  const isIconOnly = variant === 'icon-circular';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && stylesPressed[variant],
        isIconOnly && styles.iconCircular,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          isIconOnly && styles.iconText,
          { color: isInverse ? colors.canvas : colors.ink },
        ]}
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: rounded.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  secondary: {
    backgroundColor: colors.ink,
    borderRadius: rounded.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  tertiary: {
    backgroundColor: colors.canvas,
    borderColor: colors.ink,
    borderRadius: rounded.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  'icon-circular': {
    backgroundColor: colors.canvas,
    borderColor: colors.ink,
    borderWidth: 1,
  },
  iconCircular: {
    borderRadius: rounded.full,
    padding: spacing.sm,
    minWidth: 40,
    minHeight: 40,
  },
  iconText: {
    fontSize: 20,
  },
  text: {
    ...typography['button-md'],
    color: colors.ink,
  },
});

const stylesPressed = StyleSheet.create({
  primary: {
    opacity: 0.85,
  },
  secondary: {
    opacity: 0.85,
  },
  tertiary: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  'icon-circular': {
    backgroundColor: colors.ink,
  },
});
