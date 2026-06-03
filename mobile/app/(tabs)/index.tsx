import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OpportunityItem } from '@/src/components/OpportunityItem';
import { Chip } from '@/src/components/Chip';
import { SectionHeader } from '@/src/components/SectionHeader';
import { typography, spacing, colors } from '@/src/design-system';
import { useOpportunities } from '@/src/hooks/useOpportunities';
import { getUserToken } from '@/src/api/identity';
import { useLocale } from '@/src/hooks/useLocale';

const FILTERS = [
  { key: null, fr: 'Tous', ar: 'الكل', tzm: 'ⴽⵓⵍ' },
  { key: 'sport', fr: 'Sport', ar: 'رياضة', tzm: 'ⵙⴱⵓⵕⵜ' },
  { key: 'culture', fr: 'Culture', ar: 'ثقافة', tzm: 'ⵉⴷⵍⴻⵙ' },
  { key: 'formation', fr: 'Formation', ar: 'تكوين', tzm: 'ⴰⵙⴻⵍⵎⴻⴷ' },
  { key: 'loisirs', fr: 'Loisirs', ar: 'ترفيه', tzm: 'ⴰⵙⵖⵉⵏⵣⵉ' },
  { key: 'musique', fr: 'Musique', ar: 'موسيقى', tzm: 'ⴰⵥⴰⵡⴰⵏ' },
  { key: 'benevolat', fr: 'Bénévolat', ar: 'تطوع', tzm: 'ⴰⵙⴻⵡⵡⴰⵚ' },
] as const;

const ITEM_HEIGHT = 160;

export default function OpportunitiesScreen() {
  const { locale } = useLocale();
  const { opportunities, filterByCategory, loading, stale, fetchOpportunities } = useOpportunities();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getUserToken().then((token) => {
      fetchOpportunities(token, locale);
    });
  }, [locale, fetchOpportunities]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const token = await getUserToken();
    await fetchOpportunities(token, locale);
    setRefreshing(false);
  }, [locale, fetchOpportunities]);

  const handlePress = useCallback((eventId: string) => {
    router.push(`/opportunity/${eventId}` as never);
  }, []);

  const filtered = activeFilter ? filterByCategory(activeFilter) : opportunities;

  const getFilterLabel = (filter: (typeof FILTERS)[number]) => {
    if (locale === 'ar') return filter.ar;
    if (locale === 'tzm') return filter.tzm;
    return filter.fr;
  };

  const title = locale === 'fr' ? 'Opportunités' : locale === 'ar' ? 'الفرص' : 'ⵜⵉⵖⴻⵍⵍⴰⵙⵉⵏ';

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof opportunities)[number] }) => (
      <OpportunityItem
        id={item.id}
        title={item.title}
        category={item.category}
        date={item.date}
        distance={item.distance}
        slotsLeft={item.slotsLeft}
        establishmentName={item.establishmentName}
        onPress={handlePress}
        accessibilityLabel={`${item.title}, ${item.category}, ${item.distance}`}
      />
    ),
    [handlePress],
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle} maxFontSizeMultiplier={1.3}>
        {locale === 'fr' ? 'Aucune opportunité' : locale === 'ar' ? 'لا توجد فرص' : 'ⵓⵍⴰⵛ ⵜⵉⵖⴻⵍⵍⴰⵙⵉⵏ'}
      </Text>
      <Text style={styles.emptySub} maxFontSizeMultiplier={1.3}>
        {locale === 'fr'
          ? 'Essaie de modifier les filtres ou le rayon'
          : locale === 'ar'
            ? 'جرب تغيير الفلاتر أو النطاق'
            : 'ⵄⴰⵡⴻⴷ ⴰⵕⵎⵉ ⵙ ⵓⵙⵏⴼⵍ ⵏ ⵉⵙⵎⴷⴰⵢ ⵏⴻⵖ ⵓⴱⵄⴰⴷ'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionHeader title={title} accessibilityLabel={title} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterContainer}
      >
        {FILTERS.map((filter) => (
          <Chip
            key={filter.key ?? 'all'}
            label={getFilterLabel(filter)}
            selected={activeFilter === filter.key}
            onPress={() => setActiveFilter(filter.key)}
            accessibilityLabel={`Filtrer par ${getFilterLabel(filter)}`}
            style={styles.filterChip}
          />
        ))}
      </ScrollView>

      {stale ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {locale === 'fr'
              ? 'Données en cache — hors connexion'
              : locale === 'ar'
                ? 'بيانات مخزنة — غير متصل'
                : 'ⵉⵙⴻⴼⴽⴰ ⵢⴻⵜⵜⵡⴰⵃⴻⴹⵥⴻⵏ — ⵎⴰⵛⵉ ⵙ ⵜⵓⵇⵇⵏⴰ'}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={loading ? null : renderEmpty}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.ink}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.list}
      />

      {loading && opportunities.length === 0 ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  filterContainer: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexShrink: 0,
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
  offlineBanner: {
    backgroundColor: colors.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.xl,
    borderRadius: spacing.lg,
    marginBottom: spacing.sm,
  },
  offlineText: {
    ...typography['body-sm-strong'],
    color: colors.canvas,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.canvas,
  },
});
