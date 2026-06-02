import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, typography, spacing } from '../../src/design-system';

const MOCK_DETAIL: Record<string, {
  title: string;
  category: string;
  description: string;
  address: string;
  date: string;
  slotsLeft: number;
  slotsTotal: number;
  establishmentName: string;
  contact: string;
}> = {
  evt_1: {
    title: 'Tournoi de Handball Inter-quartiers',
    category: 'Sport',
    description:
      'Tournoi inter-quartiers ouvert à tous les jeunes de 15 à 25 ans. Équipes de 7 joueurs. Inscription gratuite.',
    address: 'Rue des Frères Bouchama, Bir Mourad Raïs, Alger',
    date: 'Samedi 14 Juin 2026 · 09:00 - 16:00',
    slotsLeft: 8,
    slotsTotal: 20,
    establishmentName: 'Maison de Jeunes Bir Mourad Raïs',
    contact: '+213 23 XX XX XX',
  },
};

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = id ? MOCK_DETAIL[id] : undefined;

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Opportunité introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.category}>{detail.category}</Text>
        <Text style={styles.title}>{detail.title}</Text>
      </View>

      <Card variant="content">
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{detail.description}</Text>
      </Card>

      <Card variant="content">
        <Text style={styles.sectionTitle}>Détails</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{detail.date}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Lieu</Text>
          <Text style={styles.value}>{detail.address}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Établissement</Text>
          <Text style={styles.value}>{detail.establishmentName}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Places</Text>
          <Text style={styles.value}>
            {detail.slotsLeft} / {detail.slotsTotal} disponibles
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{detail.contact}</Text>
        </View>
      </Card>

      <Button
        title="Je participe"
        disabled={detail.slotsLeft === 0}
        onPress={() => console.log('RSVP for:', id)}
      />
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
    paddingBottom: spacing['3xl'],
  },
  hero: {
    gap: spacing.sm,
  },
  category: {
    ...typography.caption,
    color: colors.positiveDeep,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  title: {
    ...typography.displayXs,
    color: colors.ink,
  },
  sectionTitle: {
    ...typography.bodyMdStrong,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyMd,
    color: colors.body,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  label: {
    ...typography.bodySm,
    color: colors.mute,
    flex: 1,
  },
  value: {
    ...typography.bodySmStrong,
    color: colors.ink,
    flex: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: colors.canvasSoft,
    marginVertical: spacing.sm,
  },
  error: {
    ...typography.bodyMd,
    color: colors.mute,
    textAlign: 'center',
    marginTop: spacing['3xl'],
  },
});
