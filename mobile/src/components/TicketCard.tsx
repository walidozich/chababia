import { memo } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ArrowRight } from 'lucide-react-native';
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
      <View style={styles.cardInner}>
        <View style={styles.topSection}>
          <View style={styles.iconShell}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M4 4h16v16H4z" />
              <Path d="M4 8h16" />
              <Path d="M4 12h16" />
              <Path d="M12 8v8" />
            </Svg>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={1}>
              {eventTitle}
            </Text>
            <View style={styles.metas}>
              <Badge
                label={eventCode}
                variant="positive"
                accessibilityLabel={`Code événement : ${eventCode}`}
              />
              <Text style={styles.date} maxFontSizeMultiplier={1.3} numberOfLines={1}>
                {date}
              </Text>
            </View>
          </View>
          <ArrowRight size={20} color={colors.mute} strokeWidth={2} />
        </View>

        {qrCode ? <View style={styles.qrContainer}>{qrCode}</View> : null}

        {address ? (
          <Text style={styles.address} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {address}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    borderRadius: 22,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: '#ece9de',
    shadowColor: '#c8c0b3',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardInner: {
    padding: spacing.lg,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconShell: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#f5f2e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography['body-md-strong'],
    color: colors.ink,
  },
  metas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    ...typography.caption,
    color: colors.body,
  },
  address: {
    ...typography['body-sm'],
    color: colors.body,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f0ede4',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
