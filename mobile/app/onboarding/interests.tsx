import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, GraduationCap, Heart } from 'lucide-react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { OnboardingFrame } from '@/src/components/OnboardingFrame';
import { Button } from '@/src/components/Button';
import { colors, spacing, typography } from '@/src/design-system';
import { useLocale } from '@/src/hooks/useLocale';
import { t } from '@/src/i18n';
import { pb } from '@/src/api/client';
import { setPref, keys } from '@/src/storage/prefs';

type SimpleIconProps = { size?: number; color?: string; strokeWidth?: number };

function DumbbellIcon({ size = 24, color = '#000', strokeWidth = 2 }: SimpleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6.5 6.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5ZM17.5 6.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <Path d="M6.5 4v16M17.5 4v16" />
      <Path d="M6.5 17.5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5ZM17.5 17.5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5Z" />
      <Path d="M15 12H9" />
    </Svg>
  );
}

function MusicIcon({ size = 24, color = '#000', strokeWidth = 2 }: SimpleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18V5l12-2v13" />
      <Circle cx="6" cy="18" r="3" />
      <Circle cx="18" cy="16" r="3" />
    </Svg>
  );
}

function LeafIcon({ size = 24, color = '#000', strokeWidth = 2 }: SimpleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.2 17.9 2 21 2c0 3.1-2.2 5.5-4.9 11.2A7 7 0 0 1 11 20Z" />
      <Path d="M2 22 10 14" />
    </Svg>
  );
}

const INTERESTS = [
  { key: 'sport', Icon: DumbbellIcon },
  { key: 'culture', Icon: Palette },
  { key: 'formation', Icon: GraduationCap },
  { key: 'musique', Icon: MusicIcon },
  { key: 'ecologie', Icon: LeafIcon },
  { key: 'benevolat', Icon: Heart },
] as const;

export default function InterestsScreen() {
  const { locale } = useLocale();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const texts = useMemo(
    () => ({
      title: t(locale, 'onboarding.interests.title'),
      subtitle: t(locale, 'onboarding.interests.subtitle'),
      section: locale === 'fr' ? 'CENTRES D\'INTÉRÊT' : locale === 'ar' ? 'مراكز الاهتمام' : 'ⵉⵎⵓⵣⴻⵔⵏ',
      hint: locale === 'fr' ? 'Sélectionne jusqu\'à 6' : locale === 'ar' ? 'اختر حتى 6' : 'ⵙⵟⴼ ⴰⵔ 6',
      continue: t(locale, 'onboarding.interests.continue'),
    }),
    [locale]
  );

  const getLabel = (key: (typeof INTERESTS)[number]['key']) => {
    return t(locale, `onboarding.interests.${key}`);
  };

  const handleToggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); return next; }
      if (next.size >= 6) return next;
      next.add(key);
      return next;
    });
  };

  const handleContinue = async () => {
    await setPref(keys.interests, [...selected])

    if (pb.authStore.isValid) {
      try {
        const userId = pb.authStore.model?.id
        if (userId) {
          await pb.collection('users').update(userId, { interests: [...selected] })
        }
      } catch {}
    }

    router.push('/onboarding/radius');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingFrame
        step={3}
        totalSteps={4}
        title={texts.title}
        subtitle={texts.subtitle}
        accessibilityLabel="Onboarding centres d'intérêt"
        footer={
          <Button
            title={texts.continue}
            variant="primary"
            accessibilityLabel={texts.continue}
            onPress={handleContinue}
          />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.2}>
            {texts.section}
          </Text>
          <Text style={styles.sectionHint} maxFontSizeMultiplier={1.2}>
            {texts.hint}
          </Text>
        </View>

        <View style={styles.grid}>
          {INTERESTS.map(({ key, Icon }) => {
            const active = selected.has(key);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={getLabel(key)}
                onPress={() => handleToggle(key)}
                style={({ pressed }) => [
                  styles.tile,
                  active ? styles.tileActive : styles.tileInactive,
                  pressed && styles.tilePressed,
                ]}
              >
                <View style={styles.tileIcon}>
                  <Icon size={28} color={active ? colors.canvas : colors.ink} strokeWidth={1.9} />
                </View>
                <Text
                  style={[styles.tileLabel, active ? styles.tileLabelActive : styles.tileLabelInactive]}
                  maxFontSizeMultiplier={1.2}
                  numberOfLines={1}
                >
                  {getLabel(key)}
                </Text>
              </Pressable>
            );
          })}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography['body-sm-strong'],
    letterSpacing: 0.8,
    color: colors.body,
  },
  sectionHint: {
    ...typography['body-sm-strong'],
    color: colors.inkDeep,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    minHeight: 130,
    borderRadius: 22,
    borderWidth: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileInactive: {
    backgroundColor: colors.canvas,
    borderColor: '#d7d7cd',
  },
  tileActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tilePressed: {
    transform: [{ scale: 0.98 }],
  },
  tileIcon: {
    marginTop: spacing.xs,
  },
  tileLabel: {
    ...typography['body-sm-strong'],
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tileLabelActive: {
    color: colors.canvas,
  },
  tileLabelInactive: {
    color: colors.ink,
  },
});
