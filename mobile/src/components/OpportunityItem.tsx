import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';

export type OpportunityData = {
  id: string;
  title: string;
  category: string;
  distanceM: number;
  dateTs: number;
  slotsLeft: number;
  establishmentName: string;
};

type OpportunityItemProps = {
  opportunity: OpportunityData;
  onPress: (id: string) => void;
};

export function OpportunityItem({ opportunity, onPress }: OpportunityItemProps) {
  const date = new Date(opportunity.dateTs * 1000);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const distanceKm = (opportunity.distanceM / 1000).toFixed(1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${opportunity.title}, ${opportunity.category}, ${distanceKm} km, ${formattedDate}`}
      onPress={() => onPress(opportunity.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.category} numberOfLines={1}>
          {opportunity.category}
        </Text>
        <Text style={styles.distance} numberOfLines={1}>
          {distanceKm} km
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {opportunity.title}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta} numberOfLines={1}>
          {opportunity.establishmentName}
        </Text>
        <Text style={styles.date} numberOfLines={1}>
          {formattedDate}
        </Text>
      </View>

      {opportunity.slotsLeft > 0 && (
        <Text style={styles.slots} numberOfLines={1}>
          {opportunity.slotsLeft} places restantes
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.canvas,
    borderRadius: rounded.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.canvasSoft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...typography.caption,
    color: colors.positiveDeep,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: rounded.pill,
    overflow: 'hidden',
  },
  distance: {
    ...typography.caption,
    color: colors.mute,
  },
  title: {
    ...typography.bodyMdStrong,
    color: colors.ink,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    ...typography.bodySm,
    color: colors.body,
    flex: 1,
  },
  date: {
    ...typography.bodySm,
    color: colors.mute,
  },
  slots: {
    ...typography.caption,
    color: colors.positive,
  },
});
