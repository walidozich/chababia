import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { QrCode } from '@/src/components/QrCode';
import { Badge } from '@/src/components/Badge';
import { typography, spacing, colors } from '@/src/design-system';
import { api } from '@/src/api/client';
import { getUserToken } from '@/src/api/identity';
import { useLocale } from '@/src/hooks/useLocale';
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP';
import detailFixture from '@/src/api/__fixtures__/opportunity-detail.json';
import opportunitiesFixture from '@/src/api/__fixtures__/opportunities.json';

interface OpportunityDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  date_ts: number;
  end_ts: number;
  address: string;
  slots_total: number;
  slots_left: number;
  contact: string;
  establishment_id: string;
}

function formatFullDate(ts: number, locale: string): string {
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

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLocale();
  const { rsvp, submitting } = useRSVP();
  const [detail, setDetail] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmedTicket, setConfirmedTicket] = useState<StoredTicket | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const token = await getUserToken();

      const { data, error } = await api.get<OpportunityDetail>(`/opportunities/${id}`, {
        Authorization: `Bearer ${token}`,
      });

      if (error || !data) {
        // fallback to fixture data
        const fixture = detailFixture as OpportunityDetail;
        const list = opportunitiesFixture.data.find((o) => o.id === id);
        setDetail({
          ...fixture,
          id: id ?? fixture.id,
          title: list?.title ?? fixture.title,
          category: list?.category ?? fixture.category,
          slots_left: list?.slots_left ?? fixture.slots_left,
        });
        setLoading(false);
        return;
      }

      setDetail(data);
      setLoading(false);
    };

    if (id) loadDetail();
  }, [id]);

  const handleRSVP = async () => {
    if (!detail) return;
    const token = await getUserToken();
    const ticket = await rsvp(detail.id, detail.title, token);
    if (ticket) {
      setConfirmedTicket(ticket);

      const notifyTime = detail.date_ts - 3600;
      const now = Math.floor(Date.now() / 1000);

      if (notifyTime > now) {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === 'granted') {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: locale === 'fr' ? 'Rappel événement' : locale === 'ar' ? 'تذكير بالفعالية' : 'ⴰⵙⵎⴻⴽⵜⵉ ⵏ ⵓⵖⴻⵍⵍⵓⵢ',
                body: `${detail.title} ${locale === 'fr' ? 'dans 1 heure' : locale === 'ar' ? 'بعد ساعة' : 'ⴳ ⵢⵉⵡⴻⵏ ⵏ ⵓⵙⵔⴰⴳ'}`,
                data: { rsvpId: ticket.rsvpId },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: notifyTime,
              },
            });
          }
        } catch {
          // notifications not supported in Expo Go — silently ignore
        }
      }
    }
  };

  const handleViewTicket = () => {
    if (!confirmedTicket) return;
    router.push(`/ticket/${confirmedTicket.rsvpId}` as never);
  };

  const handleOpenMaps = () => {
    if (!detail) return;
    const encodedAddress = encodeURIComponent(detail.address);
    const url = Platform.select({
      ios: `maps:?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
      default: `https://maps.google.com/?q=${encodedAddress}`,
    });
    if (url) Linking.openURL(url);
  };

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const texts = {
    description: locale === 'fr' ? 'Description' : locale === 'ar' ? 'الوصف' : 'ⴰⴳⵍⴰⵎ',
    address: locale === 'fr' ? 'Adresse' : locale === 'ar' ? 'العنوان' : 'ⵜⴰⵏⵙⴰ',
    contact: locale === 'fr' ? 'Contact' : locale === 'ar' ? 'اتصال' : 'ⴰⵏⵎⵉⵍⵉ',
    date: locale === 'fr' ? 'Date' : locale === 'ar' ? 'التاريخ' : 'ⴰⵣⴻⵎⵣ',
    open_maps: locale === 'fr' ? 'Ouvrir dans Maps' : locale === 'ar' ? 'فتح في الخرائط' : 'ⵍⴷⵉ ⴳ ⵍⴻⴽⵡⴰⵢⴻⵙ',
    rsvp: locale === 'fr' ? 'Je participe' : locale === 'ar' ? 'سأشارك' : 'ⴰⴷ ⵜⴻⴽⴽⵉⵖ',
    rsvp_confirmed: locale === 'fr' ? 'Inscription confirmée !' : locale === 'ar' ? 'تم تأكيد التسجيل!' : 'ⵢⴻⵜⵜⵡⴰⵙⴻⵏⵜⴻⵎ ⵓⵙⴻⵇⴻⵔ!',
    back: locale === 'fr' ? 'Retour' : locale === 'ar' ? 'رجوع' : 'ⵖⴻⵔ ⴷⴻⴼⴼⵉⵔ',
  };

  const confirmed = confirmedTicket !== null;
  const canRSVP = detail.slots_left > 0 && !confirmed;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
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

        <View style={styles.header}>
          <Badge
            label={detail.category}
            variant="positive"
            accessibilityLabel={`Catégorie : ${detail.category}`}
          />
          <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={3}>
            {detail.title}
          </Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.slots} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {detail.slots_left > 0
              ? `${detail.slots_left} ${locale === 'fr' ? 'places restantes' : locale === 'ar' ? 'أماكن متبقية' : 'ⵉⴷⵉⴳⴻⵏ ⵢⴻⴳⴳⴰⵎⴻⵏ'}`
              : locale === 'fr'
                ? 'Complet'
                : locale === 'ar'
                  ? 'مكتمل'
                  : 'ⵢⴻⵛⵄⴰ'}
          </Text>
        </View>

        <Card variant="content" style={styles.section}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
            {texts.date}
          </Text>
          <Text style={styles.sectionText} maxFontSizeMultiplier={1.3}>
            {formatFullDate(detail.date_ts, locale)}
          </Text>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
            {texts.description}
          </Text>
          <Text style={styles.sectionText} maxFontSizeMultiplier={1.3}>
            {detail.description}
          </Text>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
            {texts.address}
          </Text>
          <Text style={styles.sectionText} maxFontSizeMultiplier={1.3} numberOfLines={3}>
            {detail.address}
          </Text>
          <View style={styles.mapButton}>
            <Button
              title={texts.open_maps}
              variant="tertiary"
              accessibilityLabel={texts.open_maps}
              onPress={handleOpenMaps}
            />
          </View>
        </Card>

        {detail.contact ? (
          <Card variant="content" style={styles.section}>
            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
              {texts.contact}
            </Text>
            <Text style={styles.sectionText} maxFontSizeMultiplier={1.3}>
              {detail.contact}
            </Text>
          </Card>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {confirmed && confirmedTicket ? (
          <View style={styles.confirmedSection}>
            <QrCode value={confirmedTicket.qrPayload} size={120} />
            <Text style={styles.confirmedCode} maxFontSizeMultiplier={1.3} numberOfLines={1}>
              {confirmedTicket.eventCode}
            </Text>
            <View style={styles.ticketButton}>
              <Button
                title={locale === 'fr' ? 'Voir mon billet' : locale === 'ar' ? 'عرض التذكرة' : 'ⵣⴻⵕ ⵜⵉⵇⵕⵉⵟ'}
                variant="secondary"
                accessibilityLabel={locale === 'fr' ? 'Voir mon billet' : 'عرض التذكرة'}
                onPress={handleViewTicket}
              />
            </View>
          </View>
        ) : (
          <Button
            title={canRSVP ? texts.rsvp : (locale === 'fr' ? 'Complet' : locale === 'ar' ? 'مكتمل' : 'ⵢⴻⵛⵄⴰ')}
            variant="primary"
            accessibilityLabel={texts.rsvp}
            onPress={handleRSVP}
            disabled={!canRSVP || submitting}
          />
        )}
      </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  backRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography['display-xs'],
    color: colors.ink,
    marginTop: spacing.sm,
  },
  meta: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  slots: {
    ...typography['body-md-strong'],
    color: colors.ink,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography['body-sm-strong'],
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  sectionText: {
    ...typography['body-md'],
    color: colors.ink,
  },
  mapButton: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    backgroundColor: colors.canvas,
  },
  confirmedSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  confirmedCode: {
    ...typography['body-sm-strong'],
    color: colors.ink,
  },
  ticketButton: {
    width: '100%',
  },
});
