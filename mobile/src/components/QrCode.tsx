import { View, StyleSheet } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { colors, spacing, rounded } from '../design-system';

interface QrCodeProps {
  value: string;
  size: number;
}

export function QrCode({ value, size }: QrCodeProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inner}>
        <QRCodeSVG
          value={value}
          size={size}
          color={colors.ink}
          backgroundColor={colors.primary}
          logoSize={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: rounded.xl,
    padding: spacing.xl,
    alignSelf: 'center',
  },
  inner: {
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    padding: spacing.md,
  },
});
