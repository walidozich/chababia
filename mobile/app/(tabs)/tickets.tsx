import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TicketCard } from '../../src/components/TicketCard';
import { colors, typography, spacing } from '../../src/design-system';

const MOCK_TICKETS = [
  {
    rsvpId: 'rsvp_z9y8x7',
    eventCode: 'HAND-BMR-0614',
    qrPayload: 'ODEJ:rsvp_z9y8x7:HAND-BMR-0614',
    eventTitle: 'Tournoi de Handball Inter-quartiers',
    eventDate: 'Sam. 14 Juin 2026',
    establishmentName: 'Maison de Jeunes Bir Mourad Raïs',
    isPast: false,
  },
  {
    rsvpId: 'rsvp_a1b2c3',
    eventCode: 'PHOTO-HYD-0520',
    qrPayload: 'ODEJ:rsvp_a1b2c3:PHOTO-HYD-0520',
    eventTitle: 'Atelier de Photographie Numérique',
    eventDate: 'Dim. 20 Mai 2026',
    establishmentName: 'Maison de Jeunes Hydra',
    isPast: true,
  },
];

export default function TicketsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_TICKETS}
        keyExtractor={(item) => item.rsvpId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun billet</Text>
            <Text style={styles.emptyText}>
              Inscrivez-vous à une opportunité pour voir vos billets ici.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TicketCard
            rsvpId={item.rsvpId}
            eventCode={item.eventCode}
            qrPayload={item.qrPayload}
            eventTitle={item.eventTitle}
            eventDate={item.eventDate}
            establishmentName={item.establishmentName}
            isPast={item.isPast}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasSoft,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyTitle: {
    ...typography.displayXs,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.mute,
    textAlign: 'center',
  },
});
