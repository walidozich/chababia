import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { OnboardingFrame } from '@/src/components/OnboardingFrame';
import { Button } from '@/src/components/Button';
import { colors, spacing, typography } from '@/src/design-system';
import { useLocale } from '@/src/hooks/useLocale';
import { setPref, keys } from '@/src/storage/prefs';
import { t } from '@/src/i18n';

const RADIUS_OPTIONS = [
  { value: 1000, fr: '1 km', ar: '1 كم', tzm: '1 ⴽⵎ' },
  { value: 2000, fr: '2 km', ar: '2 كم', tzm: '2 ⴽⵎ' },
  { value: 5000, fr: '5 km', ar: '5 كم', tzm: '5 ⴽⵎ' },
] as const;

export default function RadiusScreen() {
  const { locale } = useLocale();
  const [radius, setRadius] = useState(1000);
  const [loading, setLoading] = useState(false);

  const texts = {
    title: t(locale, 'onboarding.radius.title'),
    subtitle: t(locale, 'onboarding.radius.subtitle'),
    explanation: t(locale, 'onboarding.radius.location_explanation'),
    start: t(locale, 'onboarding.radius.continue'),
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
        await Location.getCurrentPositionAsync({});
      }
    } catch {
      // Continue without location.
    }

    await setPref(keys.radius, radius);
    await setPref(keys.onboardingDone, true);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingFrame
        step={4}
        totalSteps={4}
        title={texts.title}
        subtitle={texts.subtitle}
        accessibilityLabel="Onboarding rayon"
        onBack={() => router.back()}
        footer={
          <Button
            title={loading ? '...' : texts.start}
            variant="primary"
            accessibilityLabel={texts.start}
            onPress={handleStart}
            disabled={loading}
          />
        }
      >
        <View style={styles.radiusPill}>
          {RADIUS_OPTIONS.map((option, index) => {
            const active = radius === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityLabel={getLabel(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setRadius(option.value)}
                style={({ pressed }) => [
                  styles.radiusOption,
                  index !== 0 && styles.radiusDivider,
                  active && styles.radiusActive,
                  pressed && styles.radiusPressed,
                ]}
              >
                <Text style={[styles.radiusLabel, active ? styles.radiusLabelActive : styles.radiusLabelInactive]}>
                  {getLabel(option)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanation} maxFontSizeMultiplier={1.2}>
            {texts.explanation}
          </Text>
        </View>
      </OnboardingFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  radiusPill: {
    flexDirection: 'row',
    borderRadius: 9999,
    backgroundColor: '#f5f2e9',
    borderWidth: 1,
    borderColor: '#d8d3c5',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  radiusOption: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusDivider: {
    borderLeftWidth: 1,
    borderLeftColor: '#e4dfd2',
  },
  radiusActive: {
    backgroundColor: colors.primaryPale,
  },
  radiusPressed: {
    opacity: 0.92,
  },
  radiusLabel: {
    ...typography['body-md-strong'],
  },
  radiusLabelActive: {
    color: colors.ink,
  },
  radiusLabelInactive: {
    color: colors.body,
  },
  explanationCard: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: '#e0ddd2',
    borderRadius: 18,
    padding: spacing.lg,
  },
  explanation: {
    ...typography['body-sm'],
    color: colors.body,
  },
});
