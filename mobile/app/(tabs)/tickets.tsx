import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { Svg, Path, Rect } from 'react-native-svg';
import { TicketCard } from '@/src/components/TicketCard';
import { SectionHeader } from '@/src/components/SectionHeader';
import { Button } from '@/src/components/Button';
import { typography, spacing } from '@/src/design-system';
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP';
import { useLocale } from '@/src/hooks/useLocale';
import { useTheme } from '@/src/theme/ThemeContext';
import { getPref, setPref, keys } from '@/src/storage/prefs';

interface LikedItem {
  id: string;
  title: string;
  category: string;
  date: string;
  savedAt: number;
}

export default function TicketsScreen() {
  const { locale } = useLocale();
  const { colors } = useTheme();
  const { loadTickets } = useRSVP();
  const [tickets, setTickets] = useState<StoredTicket[]>([]);
  const [likes, setLikes] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tickets' | 'likes'>('tickets');

  const loadAll = useCallback(async () => {
    const [loadedTickets, loadedLikes] = await Promise.all([
      loadTickets(),
      getPref<LikedItem[]>(keys.likes),
    ]);
    setTickets(loadedTickets ?? []);
    setLikes(loadedLikes ?? []);
    setLoading(false);
  }, [loadTickets]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const upcoming = tickets.filter((t) => !t.cancelled);

  const handleTicketPress = useCallback((rsvpId: string) => {
    router.push(`/ticket/${rsvpId}` as never);
  }, []);

  const handleLikePress = useCallback((id: string) => {
    router.push(`/opportunity/${id}` as never);
  }, []);

  const removeLike = useCallback(async (id: string) => {
    const next = likes.filter((l) => l.id !== id);
    setLikes(next);
    await setPref(keys.likes, next);
  }, [likes]);

  if (loading) return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
      <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
    </SafeAreaView>
  );

  const tabLabel = locale === 'fr' ? 'Mes billets' : locale === 'ar' ? 'تذاكري' : 'ⵜⵉⵇⵕⵉⵟⴰⵜ ⵉⵡ';
  const likesLabel = locale === 'fr' ? 'Favoris' : locale === 'ar' ? 'المفضلة' : 'ⵉⵙⵎⵏⵉⴹⴻⵏ';
  const emptyTickets = locale === 'fr' ? 'Aucun billet pour le moment' : locale === 'ar' ? 'لا توجد تذاكر حالياً' : 'ⵓⵍⴰⵛ ⵜⵉⵇⵕⵉⵟⴰⵜ ⵖⵉⵍⴰ';
  const emptyLikes = locale === 'fr' ? 'Aucun favori pour le moment' : locale === 'ar' ? 'لا توجد مفضلات حالياً' : 'ⵓⵍⴰⵛ ⵉⵙⵎⵏⵉⴹⴻⵏ ⵖⵉⵍⴰ';
  const emptyLikesSub = locale === 'fr' ? 'Like une opportunité pour la retrouver ici' : locale === 'ar' ? 'أعجب بفرصة لتجدها هنا' : 'ⵙⵎⵏⵉⴹ ⵢⵉⵡⴻⵏ ⵏ ⵓⵖⴻⵍⵍⵓⵢ ⴰⴽⴻⵏ ⴰⴷ ⵜⴰⴼⴻⴷ ⵜⴰⵎⴰ';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <SectionHeader title={locale === 'fr' ? 'Mes billets' : locale === 'ar' ? 'تذاكري' : 'ⵜⵉⵇⵕⵉⵟⴰⵜ ⵉⵡ'} accessibilityLabel="Mes billets" />

      <View style={styles.tabRow}>
        <Pressable onPress={() => setTab('tickets')} style={[styles.tab, tab === 'tickets' && { borderBottomWidth: 2, borderBottomColor: colors.brandGreen }]}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={tab === 'tickets' ? colors.brandGreen : colors.mute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1.5M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 7h18" />
            <Path d="M12 14v.01" />
          </Svg>
          <Text style={[styles.tabText, { color: tab === 'tickets' ? colors.brandGreen : colors.mute }]} maxFontSizeMultiplier={1.2}>{tabLabel}</Text>
          {upcoming.length > 0 && <View style={[styles.badge, { backgroundColor: colors.primary }]}><Text style={styles.badgeText}>{upcoming.length}</Text></View>}
        </Pressable>
        <Pressable onPress={() => setTab('likes')} style={[styles.tab, tab === 'likes' && { borderBottomWidth: 2, borderBottomColor: colors.brandGreen }]}>
          <Heart size={16} color={tab === 'likes' ? colors.brandGreen : colors.mute} strokeWidth={2} />
          <Text style={[styles.tabText, { color: tab === 'likes' ? colors.brandGreen : colors.mute }]} maxFontSizeMultiplier={1.2}>{likesLabel}</Text>
          {likes.length > 0 && <View style={[styles.badge, { backgroundColor: colors.primary }]}><Text style={styles.badgeText}>{likes.length}</Text></View>}
        </Pressable>
      </View>

      {tab === 'tickets' ? (
        <FlatList
          data={[...upcoming, ...tickets.filter((t) => t.cancelled)]}
          keyExtractor={(item) => item.rsvpId}
          renderItem={({ item }) => (
            <TicketCard rsvpId={item.rsvpId} eventTitle={item.eventTitle} eventCode={item.eventCode} date={new Date(item.confirmationTs * 1000).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')} address="" onPress={handleTicketPress} accessibilityLabel={`${item.eventTitle}`} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{emptyTickets}</Text>
            </View>
          }
          contentContainerStyle={tickets.length === 0 ? styles.emptyList : styles.list}
        />
      ) : (
        <FlatList
          data={likes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => handleLikePress(item.id)}
              style={({ pressed }) => [styles.likeItem, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }, pressed && styles.likeItemPressed]}
            >
              <View style={styles.likeInfo}>
                <Text style={[styles.likeTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.likeMeta, { color: colors.body }]} maxFontSizeMultiplier={1.2}>{item.date}</Text>
              </View>
              <View style={styles.likeActions}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.mute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="m9 18 6-6-6-6" />
              </Svg>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{emptyLikes}</Text>
              <Text style={[styles.emptySub, { color: colors.body }]} maxFontSizeMultiplier={1.3}>{emptyLikesSub}</Text>
            </View>
          }
          contentContainerStyle={likes.length === 0 ? styles.emptyList : styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.xl },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  tabText: { ...typography['body-sm-strong'], fontSize: 13 },
  badge: { borderRadius: 9999, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { ...typography.caption, color: '#163300', fontWeight: '700', fontSize: 10 },
  list: { paddingBottom: spacing.xl },
  emptyList: { flexGrow: 1, paddingBottom: spacing.xl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { ...typography['body-md-strong'], marginBottom: spacing.sm, textAlign: 'center' },
  emptySub: { ...typography['body-sm'], textAlign: 'center' },
  likeItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.xl, marginBottom: spacing.sm, borderRadius: 16, borderWidth: 1, padding: spacing.lg },
  likeItemPressed: { opacity: 0.8 },
  likeInfo: { flex: 1 },
  likeTitle: { ...typography['body-md-strong'], marginBottom: spacing.xxs },
  likeMeta: { ...typography['body-sm'] },
  likeActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
