import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography, spacing, colors } from '@/src/design-system';
import { SectionHeader } from '@/src/components/SectionHeader';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title="Paramètres"
        subtitle="Personnalise ton expérience"
        accessibilityLabel="Paramètres de l'application"
      />
      <View style={styles.empty}>
        <Text style={styles.emptyText} maxFontSizeMultiplier={1.3}>
          Phase 6 — Settings & Accessibility
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.ink,
  },
});
