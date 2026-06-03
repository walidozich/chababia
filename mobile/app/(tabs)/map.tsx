import { useEffect, useState, useCallback, useRef } from 'react'
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Pressable, Linking, Platform,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { MapPin } from 'lucide-react-native'
import { Svg, Path, Circle } from 'react-native-svg'
import { MapPreview } from '@/src/components/MapPreview'
import { SectionHeader } from '@/src/components/SectionHeader'
import { typography, spacing } from '@/src/design-system'
import { pb } from '@/src/api/client'
import { useLocale } from '@/src/hooks/useLocale'
import { useTheme } from '@/src/theme/ThemeContext'
import { getPref, setPref, keys } from '@/src/storage/prefs'
import type { Establishment } from '@/src/api/types'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

const TYPE_COLORS: Record<string, string> = {
  youth_house: 'red-pushpin',
  youth_hostel: 'blue-pushpin',
  sports_complex: 'green-pushpin',
  youth_camp: 'olive-pushpin',
  polyvalent_hall: 'orange-pushpin',
  scientific_leisure_center: 'ltblu-pushpin',
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  youth_house: { fr: 'Maison de jeunes', ar: 'بيت الشباب', tzm: 'ⴰⵅⵅⴰⵎ ⵏ ⵉⵍⵎⴰⵣⵢⴻⵏ' },
  youth_hostel: { fr: 'Auberge de jeunes', ar: 'نزل الشباب', tzm: 'ⴰⵙⴻⵏⵙⵓ ⵏ ⵉⵍⵎⴰⵣⵢⴻⵏ' },
  sports_complex: { fr: 'Complexe sportif', ar: 'مركب رياضي', tzm: 'ⴰⴷⴷⴰⵍ ⴰⵙⴱⵓⵕⵜ' },
  youth_camp: { fr: 'Camp de jeunes', ar: 'مخيم الشباب', tzm: 'ⴰⵖⴰⵔⵉⴱⵓ ⵏ ⵉⵍⵎⴰⵣⵢⴻⵏ' },
  polyvalent_hall: { fr: 'Salle polyvalente', ar: 'قاعة متعددة الاستعمالات', tzm: 'ⵜⴰⵣⴷⴰⵖⵜ ⵜⴰⵖⴰⵔⵉⴱⵓⵜ' },
  scientific_leisure_center: { fr: 'CLS', ar: 'مركز ترفيه علمي', tzm: 'ⴰⵎⵎⴰⵙ ⵏ ⵓⵙⴷⵓⵔⵉ ⵓⵙⵙⵏⴰⵏ' },
}

interface SortedEstablishment extends Establishment {
  distance: number | null
}

export default function MapScreen() {
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [establishments, setEstablishments] = useState<SortedEstablishment[]>([])
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLon, setUserLon] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const flatListRef = useRef<FlatList<SortedEstablishment>>(null)

  const requestLocation = useCallback(async () => {
    setGpsLoading(true)
    try {
      const cached = await getPref<{ lat: number; lon: number; ts: number }>(keys.cacheGeo)
      if (cached && Date.now() - cached.ts < 24 * 60 * 60 * 1000) {
        setUserLat(cached.lat)
        setUserLon(cached.lon)
        setGpsLoading(false)
        return
      }

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({})
        setUserLat(pos.coords.latitude)
        setUserLon(pos.coords.longitude)
        await setPref(keys.cacheGeo, {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          ts: Date.now(),
        })
      }
    } catch {
      // proceed without GPS
    }
    setGpsLoading(false)
  }, [])

  useEffect(() => {
    const load = async () => {
      await requestLocation()
    }
    load()
  }, [requestLocation])

  useEffect(() => {
    const fetchEst = async () => {
      try {
        const items = await pb.collection('establishments').getFullList<Establishment>({
          filter: pb.filter('status = {:s}', { s: 'published' }),
        })

        const sorted: SortedEstablishment[] = items.map((e) => {
          let dist: number | null = null
          if (userLat != null && userLon != null && e.latitude && e.longitude) {
            dist = haversine(userLat, userLon, e.latitude, e.longitude)
          }
          return { ...e, distance: dist }
        })

        sorted.sort((a, b) => {
          if (a.distance == null && b.distance == null) return a.name.localeCompare(b.name)
          if (a.distance == null) return 1
          if (b.distance == null) return -1
          return a.distance - b.distance
        })

        setEstablishments(sorted)
      } catch {
        setEstablishments([])
      }
      setLoading(false)
    }

    fetchEst()
  }, [userLat, userLon])

  const handleOpenMaps = (lat: number | undefined, lon: number | undefined, name: string) => {
    if (!lat || !lon) return
    const encoded = encodeURIComponent(name)
    const url = Platform.select({
      ios: `maps:?q=${encoded}&ll=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${encoded}`,
      default: `https://maps.google.com/?q=${lat},${lon}`,
    })
    if (url) Linking.openURL(url)
  }

  const handleMarkerPress = useCallback((id: string) => {
    const idx = establishments.findIndex((e) => e.id === id)
    if (idx === -1) return

    setHighlightedId(id)
    flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 })

    setTimeout(() => setHighlightedId(null), 2500)
  }, [establishments])

  const handleCall = (phone: string | undefined) => {
    if (!phone) return
    Linking.openURL(`tel:${phone}`)
  }

  const mapMarkers = establishments
    .filter((e) => e.latitude && e.longitude)
    .map((e) => ({
      id: e.id,
      lat: e.latitude!,
      lon: e.longitude!,
      label: e.name,
      color: TYPE_COLORS[e.type] ?? 'red-pushpin',
    }))

  const title = locale === 'fr' ? 'Carte' : locale === 'ar' ? 'خريطة' : 'ⵜⴰⴽⴰⵕⴹⴰ'

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <FlatList
        ListHeaderComponent={
          <View>
            <SectionHeader title={title} accessibilityLabel={title} />

            {mapMarkers.length > 0 ? (
              <View style={styles.mapWrap}>
                <MapPreview markers={mapMarkers} centerLat={userLat} centerLon={userLon} zoom={13} aspectRatio={2} onMarkerPress={handleMarkerPress} />
              </View>
            ) : null}

            {userLat != null ? (
              <View style={styles.locationBanner}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m3 11 19-9-9 19-2-8-8-2Z" />
                </Svg>
                <Text style={[styles.locationText, { color: colors.body }]} maxFontSizeMultiplier={1.2}>
                  {locale === 'fr'
                    ? 'Position actuelle — trié par proximité'
                    : locale === 'ar'
                      ? 'الموقع الحالي — مرتب حسب القرب'
                      : 'ⴰⴷⵉⵖⴻⵏ ⴰⴳⵉⴷⴰⵍ — ⵢⴻⵜⵜⵓⵙⵉⵣⴷⴻⴳ ⵙ ⵓⴱⵄⴰⴷ'}
                </Text>
              </View>
            ) : gpsLoading ? (
              <View style={styles.locationBanner}>
                <ActivityIndicator size="small" color={colors.mute} />
                <Text style={[styles.locationText, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
                  {locale === 'fr' ? 'Localisation...' : locale === 'ar' ? 'تحديد الموقع...' : 'ⴰⵙⵉⴷⴷⴻⴳ ⵏ ⵡⴰⴷⵉⵖⴻⵏ...'}
                </Text>
              </View>
            ) : null}

            {establishments.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>
                  {locale === 'fr' ? 'Aucun établissement' : locale === 'ar' ? 'لا توجد مؤسسات' : 'ⵓⵍⴰⵛ ⵜⵉⵙⴻⴷⴷⴰⵡⵉⵏ'}
                </Text>
              </View>
            ) : null}
          </View>
        }
        data={establishments}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
        }}
        renderItem={({ item }) => {
          const typeLabel = locale === 'ar'
            ? TYPE_LABELS[item.type]?.ar ?? item.type
            : locale === 'tzm'
              ? TYPE_LABELS[item.type]?.tzm ?? item.type
              : TYPE_LABELS[item.type]?.fr ?? item.type

          const isHighlighted = highlightedId === item.id

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.name}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isHighlighted ? colors.primaryPale : colors.cardBg,
                  borderColor: isHighlighted ? colors.primary : colors.cardBorder,
                  borderWidth: isHighlighted ? 2 : 1,
                },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.typeIcon, { backgroundColor: colors.primaryPale }]}>
                  <MapPin size={18} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.cardType, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
                    {typeLabel}
                  </Text>
                  <Text style={[styles.cardAddress, { color: colors.body }]} maxFontSizeMultiplier={1.2}>
                    {item.commune}{item.wilaya ? `, ${item.wilaya}` : ''}
                  </Text>
                </View>
                {item.distance != null ? (
                  <View style={[styles.distanceBadge, { backgroundColor: colors.primaryPale }]}>
                    <Text style={[styles.distanceText, { color: colors.primary }]} maxFontSizeMultiplier={1.2}>
                      {formatDistance(item.distance)}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={locale === 'fr' ? 'Itinéraire' : locale === 'ar' ? 'مسار' : 'ⴰⴱⵔⵉⴷ'}
                  onPress={() => handleOpenMaps(item.latitude, item.longitude, item.name)}
                  style={({ pressed: p }) => [styles.actionBtn, { backgroundColor: colors.canvasSoft }, p && styles.actionBtnPressed]}
                >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m3 11 19-9-9 19-2-8-8-2Z" />
                </Svg>
                  <Text style={[styles.actionText, { color: colors.primary }]} maxFontSizeMultiplier={1.2}>
                    {locale === 'fr' ? 'Itinéraire' : locale === 'ar' ? 'مسار' : 'ⴰⴱⵔⵉⴷ'}
                  </Text>
                </Pressable>
                {item.phone ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={locale === 'fr' ? 'Appeler' : locale === 'ar' ? 'اتصال' : 'ⴰⵖⵉⵍ'}
                    onPress={() => handleCall(item.phone)}
                    style={({ pressed: p }) => [styles.actionBtn, { backgroundColor: colors.canvasSoft }, p && styles.actionBtnPressed]}
                  >
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </Svg>
                    <Text style={[styles.actionText, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>
                      {item.phone}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
             </Pressable>
          )
        }}
        contentContainerStyle={establishments.length === 0 ? styles.emptyList : styles.list}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: spacing['3xl'] },
  emptyList: { flexGrow: 1, paddingBottom: spacing['3xl'] },
  emptyWrap: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { ...typography['body-md'], textAlign: 'center' },
  mapWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  locationBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  locationText: { ...typography['body-sm'], flex: 1 },
  card: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardPressed: { opacity: 0.85 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  typeIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1, gap: spacing.xxs },
  cardName: { ...typography['body-md-strong'] },
  cardType: { ...typography.caption, textTransform: 'capitalize' },
  cardAddress: { ...typography['body-sm'] },
  distanceBadge: {
    borderRadius: 10, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs,
  },
  distanceText: { ...typography.caption, fontWeight: '700' },
  cardActions: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  actionBtnPressed: { opacity: 0.7 },
  actionText: { ...typography['body-sm'] },
})
