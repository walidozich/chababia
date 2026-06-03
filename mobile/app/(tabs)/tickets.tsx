import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TicketCard } from '@/src/components/TicketCard';
import { SectionHeader } from '@/src/components/SectionHeader';
import { typography, spacing, colors } from '@/src/design-system';
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP';
import { useLocale } from '@/src/hooks/useLocale';

export default function TicketsScreen() {
  const { locale } = useLocale();
  const { loadTickets } = useRSVP();
  const [tickets, setTickets] = useState<StoredTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets().then((loaded) => {
      setTickets(loaded ?? []);
      setLoading(false);
    });
  }, [loadTickets]);

  const handlePress = useCallback((rsvpId: string) => {
    router.push(`/ticket/${rsvpId}` as never);
  }, []);

  const upcoming = tickets.filter((t) => !t.cancelled);
  const past = tickets.filter((t) => t.cancelled);

  const renderItem = useCallback(
    ({ item }: { item: StoredTicket }) => (
      <TicketCard
        rsvpId={item.rsvpId}
        eventTitle={item.eventTitle}
        eventCode={item.eventCode}
        date={new Date(item.confirmationTs * 1000).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')}
        address=""
        onPress={handlePress}
        accessibilityLabel={`${item.eventTitle}, ${item.eventCode}`}
      />
    ),
    [handlePress, locale],
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle} maxFontSizeMultiplier={1.3}>
        {locale === 'fr'
          ? 'Aucun billet pour le moment'
          : locale === 'ar'
            ? 'لا توجد تذاكر حالياً'
            : 'ⵓⵍⴰⵛ ⵜⵉⵇⵕⵉⵟⴰⵜ ⵖⵉⵍⴰ'}
      </Text>
      <Text style={styles.emptySub} maxFontSizeMultiplier={1.3}>
        {locale === 'fr'
          ? 'Inscris-toi à une opportunité pour recevoir ton billet'
          : locale === 'ar'
            ? 'سجّل في فرصة لتحصل على تذكرتك'
            : 'ⵙⴻⵇⴻⵔ ⵖⴻⵔ ⵢⵉⵡⴻⵏ ⵏ ⵓⵖⴻⵍⵍⵓⵢ ⴰⴽⴻⵏ ⴰⴷ ⵜⴰⵡⵉⴷ ⵜⵉⵇⵕⵉⵟ ⵏⵏⴻⴽ'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[...upcoming, ...past]}
        keyExtractor={(item) => item.rsvpId}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <SectionHeader
              title={locale === 'fr' ? 'Mes billets' : locale === 'ar' ? 'تذاكري' : 'ⵜⵉⵇⵕⵉⵟⴰⵜ ⵉⵡ'}
              accessibilityLabel={locale === 'fr' ? 'Mes billets' : 'تذاكري'}
            />
            {upcoming.length > 0 ? (
              <Text style={styles.sectionLabel} maxFontSizeMultiplier={1.3}>
                {locale === 'fr' ? 'À venir' : locale === 'ar' ? 'القادمة' : 'ⵢⴻⵜⵜⵓⵙⵓⴷⴰⵏ'}
              </Text>
            ) : null}
          </>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={tickets.length === 0 ? styles.emptyList : styles.list}
      />
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
  list: {
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography['body-md-strong'],
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emptySub: {
    ...typography['body-sm'],
    color: colors.ink,
    textAlign: 'center',
  },
  sectionLabel: {
    ...typography['body-sm-strong'],
    color: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
});
