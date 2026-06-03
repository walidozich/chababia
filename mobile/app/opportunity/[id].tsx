import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path, Circle, Line } from 'react-native-svg'
import { ArrowRight, Clock3, MapPin } from 'lucide-react-native'
import { Button } from '@/src/components/Button'
import { QrCode } from '@/src/components/QrCode'
import { Badge } from '@/src/components/Badge'
import { typography, spacing, colors } from '@/src/design-system'
import { pb } from '@/src/api/client'
import { useLocale } from '@/src/hooks/useLocale'
import { useRSVP, type StoredTicket } from '@/src/hooks/useRSVP'
import type { Activity } from '@/src/api/types'

function formatFullDate(iso: string, locale: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { locale } = useLocale()
  const { rsvp, submitting } = useRSVP()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [registrationCount, setRegistrationCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [confirmedTicket, setConfirmedTicket] = useState<StoredTicket | null>(null)

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return
      setLoading(true)

      try {
        const a = await pb.collection('activities').getOne<Activity>(id, {
          expand: 'category,establishment',
        })
        setActivity(a)

        try {
          const regs = await pb.collection('registrations').getList(1, 1, {
            filter: pb.filter('activity = {:a} && status = {:s}', { a: id, s: 'registered' }),
          })
          setRegistrationCount(regs.totalItems)
        } catch {
          setRegistrationCount(0)
        }
      } catch {
        setActivity(null)
      }

      setLoading(false)
    }

    loadDetail()
  }, [id])

  const handleRSVP = async () => {
    if (!activity) return
    const ticket = await rsvp(activity.id, activity.title)
    if (!ticket) return

    setConfirmedTicket(ticket)
  }

  const handleViewTicket = () => {
    if (!confirmedTicket) return
    router.push(`/ticket/${confirmedTicket.rsvpId}` as never)
  }

  const handleOpenMaps = () => {
    if (!activity) return
    const address = activity.expand?.establishment?.address ?? activity.commune
    const encoded = encodeURIComponent(address)
    const url = Platform.select({
      ios: `maps:?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
      default: `https://maps.google.com/?q=${encoded}`,
    })
    if (url) Linking.openURL(url)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.loadingContainer, { gap: spacing.md }]}>
          <Text style={{ color: colors.ink }} maxFontSizeMultiplier={1.3}>
            {locale === 'fr' ? 'Activité introuvable' : locale === 'ar' ? 'النشاط غير موجود' : 'ⵓⵍⴰⵛ ⴰⵖⴻⵍⵍⵓⵢ'}
          </Text>
          <Button title={locale === 'fr' ? 'Retour' : locale === 'ar' ? 'رجوع' : 'ⵖⴻⵔ ⴷⴻⴼⴼⵉⵔ'} variant="secondary" accessibilityLabel="Retour" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    )
  }

  const texts = {
    description: locale === 'fr' ? 'Description' : locale === 'ar' ? 'الوصف' : 'ⴰⴳⵍⴰⵎ',
    address: locale === 'fr' ? 'Adresse' : locale === 'ar' ? 'العنوان' : 'ⵜⴰⵏⵙⴰ',
    contact: locale === 'fr' ? 'Contact' : locale === 'ar' ? 'اتصال' : 'ⴰⵏⵎⵉⵍⵉ',
    date: locale === 'fr' ? 'Date et heure' : locale === 'ar' ? 'التاريخ والوقت' : 'ⴰⵣⴻⵎⵣ ⴷ ⵓⵙⵔⴰⴳ',
    open_maps: locale === 'fr' ? 'Ouvrir dans Maps' : locale === 'ar' ? 'فتح في الخرائط' : 'ⵍⴷⵉ ⴳ ⵍⴻⴽⵡⴰⵢⴻⵙ',
    rsvp: locale === 'fr' ? 'Je participe' : locale === 'ar' ? 'سأشارك' : 'ⴰⴷ ⵜⴻⴽⴽⵉⵖ',
    view_ticket: locale === 'fr' ? 'Voir mon billet' : locale === 'ar' ? 'عرض التذكرة' : 'ⵣⴻⵕ ⵜⵉⵇⵕⵉⵟ',
    back: locale === 'fr' ? 'Retour' : locale === 'ar' ? 'رجوع' : 'ⵖⴻⵔ ⴷⴻⴼⴼⵉⵔ',
  }

  const categoryName = activity.expand?.category?.name ?? activity.category
  const establishmentName = activity.expand?.establishment?.name ?? ''
  const establishmentAddress = activity.expand?.establishment?.address ?? activity.commune
  const slotsLeft = activity.capacity > 0 ? activity.capacity - registrationCount : 0

  const confirmed = confirmedTicket !== null
  const canRSVP = slotsLeft > 0 && !confirmed

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
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
        </View>

        <View style={styles.heroCard}>
          <View style={styles.categoryBadge}>
            <Badge label={categoryName} variant="positive" accessibilityLabel={`Catégorie : ${categoryName}`} />
          </View>
          <Text style={styles.heroTitle} maxFontSizeMultiplier={1.2} numberOfLines={4}>
            {activity.title}
          </Text>
          <View style={styles.slotsRow}>
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <Circle cx={9} cy={7} r={4} />
              <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </Svg>
            <Text style={styles.slotsText} maxFontSizeMultiplier={1.3}>
              {activity.capacity > 0
                ? slotsLeft > 0
                  ? `${slotsLeft} ${locale === 'fr' ? 'places restantes' : locale === 'ar' ? 'أماكن متبقية' : 'ⵉⴷⵉⴳⴻⵏ ⵢⴻⴳⴳⴰⵎⴻⵏ'}`
                  : locale === 'fr' ? 'Complet' : locale === 'ar' ? 'مكتمل' : 'ⵢⴻⵛⵄⴰ'
                : locale === 'fr' ? 'Places illimitées' : locale === 'ar' ? 'أماكن غير محدودة' : 'ⵉⴷⵉⴳⴻⵏ ⵓⵔ ⵙⵡⴰⵜⵜⴰⵏ'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconShell}>
              <Clock3 size={18} color={colors.inkDeep} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel} maxFontSizeMultiplier={1.3}>{texts.date}</Text>
              <Text style={styles.infoValue} maxFontSizeMultiplier={1.3}>
                {formatFullDate(activity.start_datetime, locale)}
              </Text>
            </View>
          </View>
        </View>

        {activity.full_description ? (
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconShell}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.inkDeep} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <Path d="M14 2v6h6" />
                  <Line x1={16} y1={13} x2={8} y2={13} />
                  <Line x1={16} y1={17} x2={8} y2={17} />
                </Svg>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel} maxFontSizeMultiplier={1.3}>{texts.description}</Text>
                <Text style={styles.infoValue} maxFontSizeMultiplier={1.3}>{activity.full_description}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconShell}>
              <MapPin size={18} color={colors.inkDeep} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel} maxFontSizeMultiplier={1.3}>{texts.address}</Text>
              <Text style={styles.infoValue} maxFontSizeMultiplier={1.3} numberOfLines={3}>
                {establishmentAddress || (locale === 'fr' ? 'Non spécifié' : locale === 'ar' ? 'غير محدد' : 'ⵓⵔ ⵢⴻⵜⵜⵡⴰⵎⴰⵍ')}
              </Text>
              {establishmentAddress ? (
                <View style={styles.mapButton}>
                  <Button title={texts.open_maps} variant="tertiary" accessibilityLabel={texts.open_maps} onPress={handleOpenMaps} />
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {activity.contact_phone ? (
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconShell}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.inkDeep} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </Svg>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel} maxFontSizeMultiplier={1.3}>{texts.contact}</Text>
                <Text style={styles.infoValue} maxFontSizeMultiplier={1.3}>{activity.contact_phone}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {confirmed && confirmedTicket ? (
          <View style={styles.confirmedSection}>
            <View style={styles.miniQrRow}>
              {confirmedTicket.qrPayload ? (
                <View style={styles.miniQrCard}>
                  <QrCode value={confirmedTicket.qrPayload} size={80} />
                </View>
              ) : null}
              <View style={styles.confirmedInfo}>
                <Text style={styles.confirmedLabel} maxFontSizeMultiplier={1.3}>
                  {locale === 'fr' ? 'Inscription confirmée' : locale === 'ar' ? 'تم تأكيد التسجيل' : 'ⵢⴻⵜⵜⵡⴰⵙⴻⵏⵜⴻⵎ ⵓⵙⴻⵇⴻⵔ'}
                </Text>
                <Text style={styles.confirmedCode} maxFontSizeMultiplier={1.3} numberOfLines={1}>
                  {confirmedTicket.eventCode}
                </Text>
              </View>
            </View>
            <Button
              title={texts.view_ticket}
              variant="primary"
              accessibilityLabel={texts.view_ticket}
              onPress={handleViewTicket}
            />
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
  )
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  heroCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.canvas,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ece9de',
    padding: spacing.xl,
    shadowColor: '#c8c0b3',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  categoryBadge: {
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography['display-xs'],
    color: colors.ink,
    marginBottom: spacing.md,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slotsText: {
    ...typography['body-md-strong'],
    color: colors.inkDeep,
  },
  infoSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.canvas,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ece9de',
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    shadowColor: '#c8c0b3',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  infoIconShell: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography['body-sm-strong'],
    color: colors.body,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography['body-md'],
    color: colors.ink,
  },
  mapButton: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#ece9de',
    backgroundColor: '#fbf9f1',
  },
  confirmedSection: {
    gap: spacing.md,
  },
  miniQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  miniQrCard: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ece9de',
    padding: spacing.sm,
    shadowColor: '#c8c0b3',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  confirmedInfo: {
    flex: 1,
  },
  confirmedLabel: {
    ...typography['body-md-strong'],
    color: colors.positive,
    marginBottom: spacing.xxs,
  },
  confirmedCode: {
    ...typography['body-sm'],
    color: colors.body,
  },
})
