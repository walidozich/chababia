import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { typography, spacing, rounded } from '../design-system';
import { useTheme } from '../theme/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon-circular';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, variant = 'primary', accessibilityLabel, style, ...props }: ButtonProps) {
  const { colors } = useTheme();
  const isInverse = variant === 'secondary';
  const isIconOnly = variant === 'icon-circular';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && [styles.primary, { backgroundColor: colors.btnPrimaryBg, shadowColor: colors.btnPrimaryShadow }],
        variant === 'secondary' && [styles.secondary, { backgroundColor: colors.ink }],
        variant === 'tertiary' && [styles.tertiary, { backgroundColor: colors.canvas, borderColor: colors.ink }],
        isIconOnly && [styles.iconCircular, { backgroundColor: colors.canvas, borderColor: colors.ink }],
        pressed && stylesPressed.base,
        variant === 'primary' && pressed && stylesPressed.primary,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          variant === 'primary' ? styles.textPrimary : styles.text,
          isIconOnly && styles.iconText,
          variant === 'secondary' && { color: colors.canvas },
          variant !== 'secondary' && variant !== 'primary' && { color: colors.ink },
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
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  primary: { borderRadius: 27, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 54, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  secondary: { borderRadius: rounded.xl, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  tertiary: { borderRadius: rounded.xl, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  iconCircular: { borderRadius: rounded.full, padding: spacing.sm, minWidth: 40, minHeight: 40, borderWidth: 1 },
  iconText: { fontSize: 20 },
  text: { ...typography['button-md'] },
  textPrimary: { fontFamily: 'Stack Sans Notch', fontSize: 24, lineHeight: 28, fontWeight: '700', color: '#3f6a13' },
});

const stylesPressed = StyleSheet.create({
  base: {},
  primary: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
