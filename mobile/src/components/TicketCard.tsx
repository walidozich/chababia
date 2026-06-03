import { memo } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, typography, spacing, rounded } from '../design-system';
import { Badge } from './Badge';

interface TicketCardProps {
  rsvpId: string;
  eventTitle: string;
  eventCode: string;
  date: string;
  address: string;
  qrCode?: React.ReactNode;
  onPress: (rsvpId: string) => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export const TicketCard = memo(function TicketCard({
  rsvpId,
  eventTitle,
  eventCode,
  date,
  address,
  qrCode,
  onPress,
  accessibilityLabel,
  style,
}: TicketCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPress(rsvpId)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.header}>
        <Badge
          label={eventCode}
          variant="positive"
          accessibilityLabel={`Code événement : ${eventCode}`}
        />
      </View>

      <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
        {eventTitle}
      </Text>

      <View style={styles.details}>
        <Text style={styles.date} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {date}
        </Text>
        <Text style={styles.address} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {address}
        </Text>
      </View>

      {qrCode ? <View style={styles.qrContainer}>{qrCode}</View> : null}
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
    marginBottom: spacing.sm,
  },
  title: {
    ...typography['display-xs'],
    color: colors.ink,
    marginBottom: spacing.md,
  },
  details: {
    gap: spacing.xs,
  },
  date: {
    ...typography['body-sm-strong'],
    color: colors.ink,
  },
  address: {
    ...typography['body-sm'],
    color: colors.ink,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
