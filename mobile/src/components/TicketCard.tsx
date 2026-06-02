import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, typography, spacing, rounded } from '../design-system';
import { Card } from './Card';

type TicketCardProps = {
  rsvpId: string;
  eventCode: string;
  qrPayload: string;
  eventTitle: string;
  eventDate: string;
  establishmentName: string;
  isPast?: boolean;
  onCancel?: () => void;
};

export function TicketCard({
  rsvpId,
  eventCode,
  qrPayload,
  eventTitle,
  eventDate,
  establishmentName,
  isPast = false,
}: TicketCardProps) {
  return (
    <Card variant={isPast ? 'featureSage' : 'content'} style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>
        {eventTitle}
      </Text>
      <Text style={styles.code} numberOfLines={1}>
        {eventCode}
      </Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={qrPayload}
          size={160}
          backgroundColor={colors.canvas}
          color={colors.ink}
          quietZone={8}
        />
      </View>

      <Text style={styles.id} numberOfLines={1}>
        {rsvpId}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta} numberOfLines={1}>
          {establishmentName}
        </Text>
        <Text style={styles.date} numberOfLines={1}>
          {eventDate}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    alignItems: 'center',
  },
  title: {
    ...typography.bodyMdStrong,
    color: colors.ink,
    textAlign: 'center',
  },
  code: {
    ...typography.caption,
    color: colors.positive,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: rounded.pill,
    overflow: 'hidden',
  },
  qrContainer: {
    padding: spacing.md,
    backgroundColor: colors.canvas,
    borderRadius: rounded.md,
  },
  id: {
    ...typography.caption,
    color: colors.mute,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
});
