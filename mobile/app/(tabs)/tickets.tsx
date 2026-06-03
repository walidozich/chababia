import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography, spacing, colors } from '@/src/design-system';
import { SectionHeader } from '@/src/components/SectionHeader';

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title="Mes billets"
        subtitle="Retrouve tes inscriptions ici"
        accessibilityLabel="Liste des billets"
      />
      <View style={styles.empty}>
        <Text style={styles.emptyText} maxFontSizeMultiplier={1.3}>
          Aucun billet pour le moment
        </Text>
        <Text style={styles.emptySub} maxFontSizeMultiplier={1.3}>
          Phase 5 — Tickets & RSVP
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
    ...typography['body-md-strong'],
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emptySub: {
    ...typography['body-sm'],
    color: colors.ink,
  },
});
