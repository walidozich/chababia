import { memo } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';
import { Badge } from './Badge';

interface OpportunityItemProps {
  id: string;
  title: string;
  category: string;
  date: string;
  distance: string;
  slotsLeft: number;
  establishmentName: string;
  onPress: (id: string) => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export const OpportunityItem = memo(function OpportunityItem({
  id,
  title,
  category,
  date,
  distance,
  slotsLeft,
  establishmentName,
  onPress,
  accessibilityLabel,
  style,
}: OpportunityItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPress(id)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.header}>
        <Badge
          label={category}
          variant="positive"
          accessibilityLabel={`Catégorie : ${category}`}
        />
        <Text style={styles.distance} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {distance}
        </Text>
      </View>

      <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
        {title}
      </Text>

      <Text style={styles.establishment} maxFontSizeMultiplier={1.3} numberOfLines={1}>
        {establishmentName}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {date}
        </Text>
        <Text style={styles.slots} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {slotsLeft > 0 ? `${slotsLeft} places restantes` : 'Complet'}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: rounded.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  distance: {
    ...typography['body-sm'],
    color: colors.ink,
  },
  title: {
    ...typography['display-xs'],
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  establishment: {
    ...typography['body-sm'],
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...typography['body-sm-strong'],
    color: colors.ink,
  },
  slots: {
    ...typography['body-sm'],
    color: colors.ink,
  },
});
