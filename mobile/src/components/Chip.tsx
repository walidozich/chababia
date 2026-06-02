import {
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, typography, rounded, spacing } from '../design-system';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: rounded.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  unselected: {
    backgroundColor: colors.canvasSoft,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    ...typography.bodySmStrong,
  },
  textUnselected: {
    color: colors.body,
  },
  textSelected: {
    color: colors.onPrimary,
  },
});
