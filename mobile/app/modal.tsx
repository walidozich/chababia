import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing, colors } from '@/src/design-system';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        Chababia
      </Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText} maxFontSizeMultiplier={1.3}>
          Fermer
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
    padding: spacing.xl,
  },
  title: {
    ...typography['display-xs'],
    color: colors.ink,
  },
  link: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  linkText: {
    ...typography['body-md-strong'],
    color: colors.ink,
    textDecorationLine: 'underline',
  },
});
