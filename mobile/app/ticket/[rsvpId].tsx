import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ArrowRight, MapPin, Clock3 } from 'lucide-react-native';
import { Button } from '@/src/components/Button';
import { QrCode } from '@/src/components/QrCode';
import { Badge } from '@/src/components/Badge';
import { typography, spacing, colors } from '@/src/design-system';
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP';
import { getUserToken } from '@/src/api/identity';
import { useLocale } from '@/src/hooks/useLocale';

function formatTicketDate(ts: number, locale: string): string {
  const date = new Date(ts * 1000);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
    ticket: locale === 'fr' ? 'Billet' : locale === 'ar' ? 'تذكرة' : 'ⵜⵉⵇⵕⵉⵟ',
    date: locale === 'fr' ? 'Date' : locale === 'ar' ? 'التاريخ' : 'ⴰⵣⴻⵎⵣ',
    info: locale === 'fr' ? 'Informations' : locale === 'ar' ? 'معلومات' : 'ⵉⵏⵖⵎⵉⵙⴻⵏ',
  };

  const qrSize = 180;
  const hasQr = !!ticket.qrPayload;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.backButton}>
            <Button
              title=""
              variant="icon-circular"
              accessibilityLabel={texts.back}
              onPress={() => router.back()}
            />
            <ArrowRight size={18} color={colors.ink} strokeWidth={2.2} style={[styles.backIcon, { transform: [{ rotate: '180deg' }] }]} />
          </View>
          <Text style={styles.passLabel} maxFontSizeMultiplier={1.2}>
            {texts.ticket}
          </Text>
          <View style={styles.sharePlaceholder} />
        </View>

        {ticket.cancelled ? (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledBannerText} maxFontSizeMultiplier={1.3}>
              {texts.cancelled}
            </Text>
          </View>
        ) : null}

        <View style={styles.walletCard}>
          <View style={styles.walletCardTop}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconShell}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M4 4h16v16H4z" />
                  <Path d="M4 8h16" />
                  <Path d="M4 12h16" />
                  <Path d="M12 8v8" />
                </Svg>
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={styles.cardEventTitle} maxFontSizeMultiplier={1.2} numberOfLines={2}>
                  {ticket.eventTitle}
                </Text>
                <Text style={styles.cardEventCode} maxFontSizeMultiplier={1.3}>
                  {ticket.eventCode}
                </Text>
              </View>
            </View>

            <View style={styles.cardDividerRow}>
              <View style={styles.cardDivider} />
              <Text style={styles.cardDividerLabel} maxFontSizeMultiplier={1.2}>
                {texts.date}
              </Text>
              <View style={styles.cardDivider} />
            </View>

            <View style={styles.cardDateTime}>
              <View style={styles.cardMetaRow}>
                <Clock3 size={14} color={colors.primary} strokeWidth={2} />
                <Text style={styles.cardMetaText} maxFontSizeMultiplier={1.3}>
                  {formatTicketDate(ticket.confirmationTs, locale)}
                </Text>
              </View>
            </View>
          </View>

          {hasQr ? (
            <View style={styles.qrSection}>
              <View style={styles.qrBackground}>
                <View style={styles.qrFrame}>
                  <QrCode value={ticket.qrPayload} size={qrSize} />
                </View>
              </View>
              <Text style={styles.qrCodeText} maxFontSizeMultiplier={1.3} numberOfLines={1}>
                {ticket.qrPayload.slice(0, 12)}...
              </Text>
            </View>
          ) : null}
        </View>

        {!ticket.cancelled ? (
          <View style={styles.actionsSection}>
            <Button
              title={texts.cancel}
              variant="tertiary"
              accessibilityLabel={texts.cancel}
              onPress={handleCancel}
              disabled={submitting}
            />
          </View>
        ) : null}

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbf9f1',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#fbf9f1',
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.ink,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
  },
  passLabel: {
    ...typography['body-sm-strong'],
    color: colors.body,
    letterSpacing: 0.8,
  },
  sharePlaceholder: {
    width: 40,
  },
  cancelledBanner: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
  },
  cancelledBannerText: {
    ...typography['body-sm-strong'],
    color: colors.canvas,
  },
  walletCard: {
    marginHorizontal: spacing.xl,
    borderRadius: 28,
    backgroundColor: colors.ink,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  walletCardTop: {
    padding: spacing.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardIconShell: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  cardEventTitle: {
    ...typography['display-xs'],
    color: colors.canvas,
  },
  cardEventCode: {
    ...typography['body-sm'],
    color: colors.primary,
    fontSize: 13,
  },
  cardDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  cardDividerLabel: {
    ...typography.caption,
    color: colors.mute,
    letterSpacing: 0.6,
  },
  cardDateTime: {
    gap: spacing.sm,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardMetaText: {
    ...typography['body-md'],
    color: colors.canvasSoft,
    flex: 1,
  },
  qrSection: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  qrBackground: {
    backgroundColor: colors.canvas,
    borderRadius: 20,
    padding: spacing.md,
  },
  qrFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeText: {
    ...typography.caption,
    color: colors.mute,
    marginTop: spacing.md,
  },
  actionsSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  footerSpacer: {
    height: spacing['2xl'],
  },
});
