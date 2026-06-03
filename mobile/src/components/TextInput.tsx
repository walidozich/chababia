import { TextInput as RNTextInput, StyleSheet, View, type TextInputProps } from 'react-native';
import { typography } from '../design-system';
import { useTheme } from '../theme/ThemeContext';

interface InputProps extends TextInputProps {
  accessibilityLabel: string;
}

export function TextInput({ accessibilityLabel, style, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
      <RNTextInput
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.inputText}
        selectionColor={colors.primary}
        style={[styles.input, { color: colors.inputText }, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { minHeight: 46, borderWidth: 1, borderRadius: 11, paddingLeft: 14, paddingRight: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, ...typography['body-md'], paddingVertical: 11, paddingRight: 10 },
});
