import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolation, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MapPin } from 'lucide-react-native';
import { Button } from '@/src/components/Button';
import { OpportunityCard } from '@/src/components/OpportunityCard';
import { Logo } from '@/src/components/Logo';
import { typography, spacing } from '@/src/design-system';
import { useOpportunities } from '@/src/hooks/useOpportunities';
import { getUserToken } from '@/src/api/identity';
import { useLocale } from '@/src/hooks/useLocale';
import { useTheme } from '@/src/theme/ThemeContext';
import { getPref, setPref, keys } from '@/src/storage/prefs';
import { t } from '@/src/i18n';

const STACK_SIZE = 3;
const SWIPE_DURATION = 200;
const SPRING_CONFIG = { damping: 18, stiffness: 200, mass: 0.8 };

export default function OpportunitiesScreen() {
  const { locale, loaded } = useLocale();
  const { colors } = useTheme();
  const { opportunities, loading, stale, fetchOpportunities } = useOpportunities();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const { width } = useWindowDimensions();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isGestureActive = useSharedValue(false);
  const currentOppRef = useRef(opportunities[0] ?? null);

  const cardWidth = Math.min(width - spacing.xl * 2, 420);
  const swipeLimit = cardWidth * 0.28;
  const offscreenX = width + 160;

  useEffect(() => { currentOppRef.current = opportunities[activeIndex] ?? null; }, [opportunities, activeIndex]);
  useEffect(() => { if (!loaded) return; setFetchAttempted(true); getUserToken().then((token) => { fetchOpportunities(token, locale); }); }, [loaded, locale, fetchOpportunities]);
  useEffect(() => { setActiveIndex(0); translateX.value = 0; translateY.value = 0; }, [opportunities, translateX, translateY]);

  const visibleCards = useMemo(() => opportunities.slice(activeIndex, activeIndex + STACK_SIZE), [activeIndex, opportunities]);

  const handleAdvance = useCallback(() => {
    const opp = currentOppRef.current;
    if (opp) {
      getPref<any[]>(keys.likes).then((existing) => {
        const list = existing ?? [];
        if (!list.find((l: any) => l.id === opp.id)) {
          list.unshift({ id: opp.id, title: opp.title, category: opp.category, date: opp.date, savedAt: Date.now() });
          setPref(keys.likes, list.slice(0, 50));
        }
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setActiveIndex((prev) => prev + 1);
  }, []);
  const handleOpenDetail = useCallback((id: string) => { router.push(`/opportunity/${id}` as never); }, []);
  const handleTap = useCallback(() => { const opp = currentOppRef.current; if (opp) handleOpenDetail(opp.id); }, [handleOpenDetail]);
  const handleSeeMore = useCallback(() => { const opp = currentOppRef.current; if (opp) handleOpenDetail(opp.id); }, [handleOpenDetail]);
  const handleRestart = useCallback(() => { setActiveIndex(0); translateX.value = 0; translateY.value = 0; }, [translateX, translateY]);

  const handleSwipeRight = useCallback(() => { translateX.value = withTiming(offscreenX, { duration: SWIPE_DURATION }, (finished) => { if (finished) { translateX.value = 0; translateY.value = 0; runOnJS(handleAdvance)(); } }); }, [offscreenX, translateX, translateY, handleAdvance]);
  const handleSwipeLeft = useCallback(() => { translateX.value = withTiming(-offscreenX, { duration: SWIPE_DURATION }, (finished) => { if (finished) { translateX.value = 0; translateY.value = 0; runOnJS(handleAdvance)(); } }); }, [offscreenX, translateX, translateY, handleAdvance]);
  const handleSnapBack = useCallback(() => { translateX.value = withSpring(0, SPRING_CONFIG); translateY.value = withSpring(0, SPRING_CONFIG); }, [translateX, translateY]);

  const panGesture = useMemo(() => Gesture.Pan()
    .minDistance(2).activeOffsetX([-10, 10]).failOffsetY([-10, 10])
    .onBegin(() => { isGestureActive.value = true; })
    .onUpdate((e) => { translateX.value = e.translationX; translateY.value = e.translationY * 0.4; })
    .onEnd((e) => { isGestureActive.value = false;
      if (Math.abs(e.velocityX) > 600) { if (e.velocityX > 0) runOnJS(handleSwipeRight)(); else runOnJS(handleSwipeLeft)(); return; }
      if (e.translationX > swipeLimit) { runOnJS(handleSwipeRight)(); }
      else if (e.translationX < -swipeLimit) { runOnJS(handleSwipeLeft)(); }
      else if (Math.abs(e.translationX) < 4 && Math.abs(e.translationY) < 4) { runOnJS(handleTap)(); runOnJS(handleSnapBack)(); }
      else { runOnJS(handleSnapBack)(); }
    }).onFinalize(() => { isGestureActive.value = false; }),
  [swipeLimit, translateX, translateY, isGestureActive, handleSwipeRight, handleSwipeLeft, handleTap, handleSnapBack]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${interpolate(translateX.value, [-cardWidth * 1.2, 0, cardWidth * 1.2], [-12, 0, 12], Extrapolation.CLAMP)}deg` }, { scale: interpolate(Math.abs(translateX.value), [0, cardWidth * 0.5], [1, 0.93], Extrapolation.CLAMP) }] }));

  const localeLabel = locale.toUpperCase();
  const headerDate = new Date().toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', { day: '2-digit', month: 'short' });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.headerLogo}><Logo width={56} height={17} /></View>
          <Text style={[styles.brand, { color: colors.brandGreen }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>Chababia</Text>
        </View>
        <View accessibilityRole="text" accessibilityLabel={localeLabel} style={[styles.localePill, { backgroundColor: colors.canvas, borderColor: colors.localePillBorder }]}>
          <Text style={[styles.localeText, { color: colors.brandGreen }]} maxFontSizeMultiplier={1.2}>{localeLabel}</Text>
        </View>
      </View>

      {stale ? <View style={[styles.offlineBanner, { backgroundColor: colors.ink }]}><Text style={[styles.offlineText, { color: colors.canvas }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>{t(locale, 'discovery.offline_banner').replace('{{date}}', headerDate)}</Text></View> : null}

      <View style={styles.deckArea}>
        {((!fetchAttempted && opportunities.length === 0) || (loading && opportunities.length === 0)) ? (
          <View style={styles.loadingState}><Text style={[styles.loadingText, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{t(locale, 'common.loading')}</Text></View>
        ) : visibleCards.length > 0 ? (
          <View style={styles.stack}>
            {visibleCards.map((item, index) => {
              const isTop = index === 0;
              const layerIndex = visibleCards.length - index;
              if (isTop) return (
                <GestureDetector key={item.id} gesture={panGesture}>
                  <Animated.View style={[styles.cardLayer, animatedStyle, { zIndex: layerIndex }]}>
                    <OpportunityCard opportunity={item} locale={locale} onLike={() => handleSwipeRight()} onDislike={() => handleSwipeLeft()} onSeeMore={() => handleSeeMore()} />
                  </Animated.View>
                </GestureDetector>
              );
              return (
                <View key={item.id} pointerEvents="none" style={[styles.cardLayer, { zIndex: layerIndex, opacity: 1 - index * 0.12, transform: [{ translateY: index * 14 }, { scale: 1 - index * 0.04 }] }]}>
                  <OpportunityCard opportunity={item} locale={locale} onLike={() => {}} onDislike={() => {}} onSeeMore={() => {}} />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{t(locale, 'discovery.no_more')}</Text>
            <Text style={[styles.emptySub, { color: colors.body }]} maxFontSizeMultiplier={1.2}>{locale === 'fr' ? 'Relance le deck pour revoir les opportunités.' : locale === 'ar' ? 'أعد تشغيل البطاقات لرؤية الفرص من جديد.' : 'ⴱⴷⵓ ⴰⵙⴻⴼⵜⴰⵔ ⵉ ⴰⴷ ⵜⵡⴰⴼⴻⵏ ⵜⵉⵖⴻⵍⵍⴰⵙⵉⵏ.'}</Text>
            <View style={styles.restartButton}><Button title={t(locale, 'discovery.restart')} variant="primary" accessibilityLabel={t(locale, 'discovery.restart')} onPress={handleRestart} /></View>
          </View>
        )}
      </View>

      <View style={styles.footerHint}>
        <Text style={[styles.footerHintText, { color: colors.body }]} maxFontSizeMultiplier={1.2}>{t(locale, 'discovery.swipe_hint')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  headerLogo: { width: 56, height: 17, justifyContent: 'center' },
  brand: { ...typography['body-md-strong'], fontSize: 18 },
  localePill: { minWidth: 44, minHeight: 32, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  localeText: { ...typography['body-sm-strong'] },
  offlineBanner: { marginHorizontal: spacing.xl, marginBottom: spacing.sm, borderRadius: 18, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  offlineText: { ...typography['body-sm-strong'], textAlign: 'center' },
  deckArea: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  stack: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardLayer: { position: 'absolute', width: '100%', maxWidth: 420, left: 0, right: 0 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...typography['body-md-strong'] },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  emptyTitle: { ...typography['display-xs'], textAlign: 'center' },
  emptySub: { ...typography['body-md'], textAlign: 'center', maxWidth: 320 },
  restartButton: { marginTop: spacing.md },
  footerHint: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  footerHintText: { ...typography['body-sm'], textAlign: 'center' },
});
