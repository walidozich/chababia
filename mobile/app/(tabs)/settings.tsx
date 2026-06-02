import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, typography, spacing } from '../../src/design-system';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card variant="featureSage" style={styles.card}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        <Text style={styles.label}>Langue</Text>
        <Text style={styles.value}>Français</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>Intérêts</Text>
        <Text style={styles.value}>Sport, Culture, Formation</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>Rayon de recherche</Text>
        <Text style={styles.value}>5 km</Text>
      </Card>

      <Card variant="featureSage" style={styles.card}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <Text style={styles.value}>Chababia v1.0.0</Text>
        <Text style={styles.description}>
          Application développée dans le cadre d'ECOHACK '26 pour connecter les
          jeunes Algériens aux opportunités ODEJ.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasSoft,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.displayXs,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySm,
    color: colors.mute,
  },
  value: {
    ...typography.bodyMdStrong,
    color: colors.ink,
  },
  description: {
    ...typography.bodySm,
    color: colors.body,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.canvasSoft,
    marginVertical: spacing.sm,
  },
});
