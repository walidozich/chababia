import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, typography, rounded, spacing } from '../design-system';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  style,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = stylesByVariant[variant];
  const stateStyle = disabled ? variantStyles.disabled : {};

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled ?? undefined }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles.default,
        stateStyle,
        pressed && !disabled && variantStyles.pressed,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          disabled && variantStyles.textDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...typography.buttonMd,
  },
});

const stylesByVariant = {
  primary: StyleSheet.create({
    default: { backgroundColor: colors.primary },
    pressed: { backgroundColor: colors.primaryActive },
    disabled: { backgroundColor: colors.canvasSoft, opacity: 0.6 },
    text: { color: colors.onPrimary },
    textDisabled: { color: colors.mute },
  }),
  secondary: StyleSheet.create({
    default: { backgroundColor: colors.canvasSoft },
    pressed: { backgroundColor: colors.primaryPale },
    disabled: { backgroundColor: colors.canvasSoft, opacity: 0.4 },
    text: { color: colors.ink },
    textDisabled: { color: colors.mute },
  }),
  tertiary: StyleSheet.create({
    default: {
      backgroundColor: colors.canvas,
      borderWidth: 1,
      borderColor: colors.ink,
    },
    pressed: { backgroundColor: colors.canvasSoft },
    disabled: { borderColor: colors.mute, opacity: 0.4 },
    text: { color: colors.ink },
    textDisabled: { color: colors.mute },
  }),
};
