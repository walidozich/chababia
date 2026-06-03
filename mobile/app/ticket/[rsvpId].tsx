import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/Button';
import { QrCode } from '@/src/components/QrCode';
import { Badge } from '@/src/components/Badge';
import { typography, spacing, colors } from '@/src/design-system';
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP';
import { getUserToken } from '@/src/api/identity';
import { useLocale } from '@/src/hooks/useLocale';

export default function TicketDetailScreen() {
  const { rsvpId } = useLocalSearchParams<{ rsvpId: string }>();
  const { locale } = useLocale();
  const { cancelRsvp, loadTickets, submitting } = useRSVP();
  const [ticket, setTicket] = useState<StoredTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findTicket = async () => {
      const tickets = await loadTickets();
      const found = tickets.find((t) => t.rsvpId === rsvpId) ?? null;
      setTicket(found);
      setLoading(false);
    };

    if (rsvpId) findTicket();
  }, [rsvpId, loadTickets]);

  const handleCancel = async () => {
    if (!ticket) return;
    const token = await getUserToken();
    await cancelRsvp(ticket.rsvpId, token);
    setTicket((t) => (t ? { ...t, cancelled: true } : t));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText} maxFontSizeMultiplier={1.3}>
            {locale === 'fr' ? 'Billet introuvable' : locale === 'ar' ? 'التذكرة غير موجودة' : 'ⵓⵍⴰⵛ ⵜⵉⵇⵕⵉⵟ'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const texts = {
    cancel: locale === 'fr' ? 'Annuler mon inscription' : locale === 'ar' ? 'إلغاء التسجيل' : 'ⵙⴻⴼⵙⵅ ⵓⵙⴻⵇⴻⵔ',
    cancelled: locale === 'fr' ? 'Annulé' : locale === 'ar' ? 'ملغى' : 'ⵢⴻⵜⵜⵡⴰⵙⴻⴼⵙⴻⵅ',
    back: locale === 'fr' ? 'Retour' : locale === 'ar' ? 'رجوع' : 'ⵖⴻⵔ ⴷⴻⴼⴼⵉⵔ',
  };

  const qrSize = 220;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backRow}>
          <Button
            title={texts.back}
            variant="tertiary"
            accessibilityLabel={texts.back}
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Badge
                label={ticket.eventCode}
                variant="positive"
                accessibilityLabel={`Code : ${ticket.eventCode}`}
              />
              {ticket.cancelled ? (
                <Badge
                  label={texts.cancelled}
                  variant="negative"
                  accessibilityLabel={texts.cancelled}
                />
              ) : null}
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={3}>
              {ticket.eventTitle}
            </Text>
          </View>

          {ticket.qrPayload ? (
            <View style={styles.qrSection}>
              <QrCode value={ticket.qrPayload} size={qrSize} />
              <Text style={styles.qrCode} maxFontSizeMultiplier={1.3} numberOfLines={2}>
                {ticket.qrPayload}
              </Text>
            </View>
          ) : null}

          {!ticket.cancelled ? (
            <View style={styles.cancelSection}>
              <Button
                title={texts.cancel}
                variant="tertiary"
                accessibilityLabel={texts.cancel}
                onPress={handleCancel}
                disabled={submitting}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.ink,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  backRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography['display-xs'],
    color: colors.ink,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  qrCode: {
    ...typography.caption,
    color: colors.ink,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  cancelSection: {
    alignItems: 'center',
  },
});
