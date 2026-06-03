import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Info } from 'lucide-react-native'
import { Button } from '@/src/components/Button'
import { SectionHeader } from '@/src/components/SectionHeader'
import { typography, spacing } from '@/src/design-system'
import { pb } from '@/src/api/client'
import { useLocale } from '@/src/hooks/useLocale'
import { useTheme } from '@/src/theme/ThemeContext'
import type { Announcement } from '@/src/api/types'

export default function AnnouncementsScreen() {
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('announcements').getFullList<Announcement>({
      sort: '-created',
      filter: pb.filter('status = {:s}', { s: 'published' }),
    })
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    )
  }

  const title = locale === 'fr' ? 'Annonces' : locale === 'ar' ? 'إعلانات' : 'ⵜⵉⴱⵔⴰⵜⵉⵏ'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <SectionHeader title={title} accessibilityLabel={title} />

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.cardHeader}>
              <Info size={16} color={colors.primary} strokeWidth={2} />
              {item.priority === 'urgent' ? (
                <View style={[styles.priorityBadge, { backgroundColor: colors.negative }]}>
                  <Text style={styles.priorityText} maxFontSizeMultiplier={1.2}>
                    {locale === 'fr' ? 'Urgent' : locale === 'ar' ? 'عاجل' : 'ⴰⵖⴻⵔⴰⴱ'}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.cardTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.cardContent, { color: colors.body }]} maxFontSizeMultiplier={1.2} numberOfLines={4}>
              {item.content}
            </Text>
            <Text style={[styles.cardDate, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
              {new Date(item.created).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')}
            </Text>
          </View>
        )}
        contentContainerStyle={announcements.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>
              {locale === 'fr' ? 'Aucune annonce' : locale === 'ar' ? 'لا توجد إعلانات' : 'ⵓⵍⴰⵛ ⵜⵉⴱⵔⴰⵜⵉⵏ'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.xl },
  emptyList: { flexGrow: 1, padding: spacing.xl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...typography['body-md'], textAlign: 'center' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  priorityBadge: { borderRadius: 6, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  priorityText: { ...typography.caption, color: '#fff', fontWeight: '700', fontSize: 10 },
  cardTitle: { ...typography['body-md-strong'], marginBottom: spacing.xs },
  cardContent: { ...typography['body-sm'], marginBottom: spacing.sm },
  cardDate: { ...typography.caption },
})
