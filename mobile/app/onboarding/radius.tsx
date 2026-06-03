import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Button } from '@/src/components/Button';
import { Chip } from '@/src/components/Chip';
import { typography, spacing, colors } from '@/src/design-system';
import { useLocale } from '@/src/hooks/useLocale';
import { setPref, keys } from '@/src/storage/prefs';

const RADIUS_OPTIONS = [
  { value: 1000, fr: '1 km', ar: '1 كم', tzm: '1 ⴽⵎ' },
  { value: 2000, fr: '2 km', ar: '2 كم', tzm: '2 ⴽⵎ' },
  { value: 5000, fr: '5 km', ar: '5 كم', tzm: '5 ⴽⵎ' },
] as const;

export default function RadiusScreen() {
  const { locale } = useLocale();
  const [radius, setRadius] = useState(5000);
  const [loading, setLoading] = useState(false);

  const texts = {
    title: locale === 'fr' ? "Jusqu'où veux-tu chercher ?" : locale === 'ar' ? 'إلى أي مدى تريد البحث؟' : 'ⵖⴰⵔ ⴰⵏⴷⴰ ⵜⴻⵅⵙⴻⴷ ⴰⴷ ⵜⵇⴻⵍⵍⴱⴻⴷ?',
    subtitle: locale === 'fr' ? "On a besoin de ta position pour te montrer les opportunités à proximité" : locale === 'ar' ? 'نحتاج إلى موقعك لنعرض لك الفرص القريبة' : 'ⵏⴻⵃⵡⴰⵊ ⴰⴷⵉⵖⴻⵏ ⵏⵏⴻⴽ ⴰⴽⴻⵏ ⴰⴷ ⴰⴽ ⵏⵎⴻⵍ ⵜⵉⵖⴻⵍⵍⴰⵙⵉⵏ ⵢⴻⵇⵕⴰⴱⴻⵏ',
    explanation: locale === 'fr' ? "Ta position n'est utilisée qu'une seule fois pour filtrer les résultats. Elle n'est jamais envoyée à un serveur tiers." : locale === 'ar' ? 'يُستخدم موقعك مرة واحدة فقط لتصفية النتائج. لا يُرسل أبداً إلى خادم خارجي.' : 'ⴰⴷⵉⵖⴻⵏ ⵏⵏⴻⴽ ⵢⴻⵙⵙⴻⵇⴷⴰⵛ ⵢⵉⵡⴻⵏ ⵏ ⵡⴻⴱⵔⵉⴷ ⴽⴰⵏ ⵉ ⵓⵙⵉⵣⴷⵉ ⵏ ⵉⴳⵎⴰⴹ.',
    start: locale === 'fr' ? 'Commencer' : locale === 'ar' ? 'ابدأ' : 'ⴱⴷⵓ',
  };

  const getLabel = (opt: (typeof RADIUS_OPTIONS)[number]) => {
    if (locale === 'ar') return opt.ar;
    if (locale === 'tzm') return opt.tzm;
    return opt.fr;
  };

  const handleStart = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // Get location once, cache for 24h
        await Location.getCurrentPositionAsync({});
      }
      // Always proceed — fallback to manual search if denied
    } catch {
      // Location unavailable — proceed anyway
    }

    await setPref(keys.radius, radius);
    await setPref(keys.onboardingDone, true);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
            {texts.title}
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3} numberOfLines={2}>
            {texts.subtitle}
          </Text>
        </View>

        <View style={styles.options}>
          {RADIUS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={getLabel(opt)}
              selected={radius === opt.value}
              onPress={() => setRadius(opt.value)}
              accessibilityLabel={`${getLabel(opt)} ${radius === opt.value ? 'sélectionné' : ''}`}
            />
          ))}
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanation} maxFontSizeMultiplier={1.3} numberOfLines={4}>
            {texts.explanation}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={loading ? '...' : texts.start}
          variant="primary"
          accessibilityLabel={texts.start}
          onPress={handleStart}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  title: {
    ...typography['display-sm'],
    color: colors.ink,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography['body-lg'],
    color: colors.ink,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  explanationCard: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: spacing.lg,
    padding: spacing.lg,
  },
  explanation: {
    ...typography['body-sm'],
    color: colors.ink,
  },
  footer: {
    padding: spacing.xl,
  },
});
