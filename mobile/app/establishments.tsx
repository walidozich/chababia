import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MapPin, ArrowRight } from 'lucide-react-native'
import { Button } from '@/src/components/Button'
import { SectionHeader } from '@/src/components/SectionHeader'
import { typography, spacing } from '@/src/design-system'
import { pb } from '@/src/api/client'
import { useLocale } from '@/src/hooks/useLocale'
import { useTheme } from '@/src/theme/ThemeContext'
import type { Establishment } from '@/src/api/types'

export default function EstablishmentsScreen() {
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('establishments').getFullList<Establishment>({
      sort: 'name',
      filter: pb.filter('status = {:s}', { s: 'published' }),
    })
      .then(setEstablishments)
      .catch(() => setEstablishments([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    )
  }

  const title = locale === 'fr' ? 'Établissements' : locale === 'ar' ? 'المؤسسات' : 'ⵜⵉⵙⴻⴷⴷⴰⵡⵉⵏ'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <View style={styles.topBar}>
        <Button title="" variant="icon-circular" accessibilityLabel="Retour" onPress={() => router.back()} />
      </View>
      <SectionHeader title={title} accessibilityLabel={title} />

      <FlatList
        data={establishments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.name}
            onPress={() => router.push(`/establishments/${item.id}` as never)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <MapPin size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.cardSub, { color: colors.body }]} maxFontSizeMultiplier={1.2}>
                  {item.commune}{item.wilaya ? `, ${item.wilaya}` : ''}
                </Text>
                <Text style={[styles.cardType, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
                  {item.type}
                </Text>
              </View>
              <ArrowRight size={18} color={colors.mute} strokeWidth={2} />
            </View>
          </Pressable>
        )}
        contentContainerStyle={establishments.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>
              {locale === 'fr' ? 'Aucun établissement' : locale === 'ar' ? 'لا توجد مؤسسات' : 'ⵓⵍⴰⵛ ⵜⵉⵙⴻⴷⴷⴰⵡⵉⵏ'}
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
  topBar: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  backIcon: { display: 'none' },
  list: { padding: spacing.xl, paddingTop: spacing.sm },
  emptyList: { flexGrow: 1, padding: spacing.xl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...typography['body-md'], textAlign: 'center' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardPressed: { opacity: 0.8 },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#e2f6d5',
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1, gap: spacing.xxs },
  cardTitle: { ...typography['body-md-strong'] },
  cardSub: { ...typography['body-sm'] },
  cardType: { ...typography.caption, textTransform: 'capitalize' },
})
