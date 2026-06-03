import { TextInput as RNTextInput, StyleSheet, View, type TextInputProps } from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';

interface InputProps extends TextInputProps {
  accessibilityLabel: string;
}

export function TextInput({ accessibilityLabel, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <RNTextInput
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.ink}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: rounded.md,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: colors.canvas,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: rounded.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography['body-md'],
  },
});
