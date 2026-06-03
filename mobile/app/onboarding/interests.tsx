import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/Button';
import { Chip } from '@/src/components/Chip';
import { typography, spacing, colors } from '@/src/design-system';
import { useLocale } from '@/src/hooks/useLocale';

const INTERESTS = [
  { key: 'sport', fr: 'Sport', ar: 'رياضة', tzm: 'ⵙⴱⵓⵕⵜ' },
  { key: 'culture', fr: 'Culture', ar: 'ثقافة', tzm: 'ⵉⴷⵍⴻⵙ' },
  { key: 'formation', fr: 'Formation', ar: 'تكوين', tzm: 'ⴰⵙⴻⵍⵎⴻⴷ' },
  { key: 'loisirs', fr: 'Loisirs', ar: 'ترفيه', tzm: 'ⴰⵙⵖⵉⵏⵣⵉ' },
  { key: 'musique', fr: 'Musique', ar: 'موسيقى', tzm: 'ⴰⵥⴰⵡⴰⵏ' },
  { key: 'benevolat', fr: 'Bénévolat', ar: 'تطوع', tzm: 'ⴰⵙⴻⵡⵡⴰⵚ' },
] as const;

export default function InterestsScreen() {
  const { locale } = useLocale();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showError, setShowError] = useState(false);

  const texts = {
    title: locale === 'fr' ? "Qu'est-ce qui t'intéresse ?" : locale === 'ar' ? 'ما الذي يثير اهتمامك؟' : 'ⴷ ⴰⵛⵓ ⵉⴽ ⵢⴻⵀⵡⴰⵏ?',
    subtitle: locale === 'fr' ? 'Choisis au moins un centre d\'intérêt' : locale === 'ar' ? 'اختر مجال اهتمام واحد على الأقل' : 'ⵙⵟⴼ ⵢⵉⵡⴻⵏ ⵏ ⵡⴰⵏⴷⴰⵡ ⵏ ⵍⴻⵀⵡⴰ',
    error: locale === 'fr' ? 'Sélectionne au moins un intérêt' : locale === 'ar' ? 'اختر اهتماماً واحداً على الأقل' : 'ⵙⵟⴼ ⵢⵉⵡⴻⵏ ⵏ ⵡⴰⵏⴷⴰⵡ ⵏ ⵓⵎⴻⵖⵔⴰⴷ',
    continue: locale === 'fr' ? 'Continuer' : locale === 'ar' ? 'متابعة' : 'ⴽⴻⵎⵎⴻⵍ',
  };

  const getLabel = (item: (typeof INTERESTS)[number]) => {
    if (locale === 'ar') return item.ar;
    if (locale === 'tzm') return item.tzm;
    return item.fr;
  };

  const toggle = (key: string) => {
    setShowError(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.size === 0) {
      setShowError(true);
      return;
    }
    router.push('/onboarding/radius');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
            {texts.title}
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {texts.subtitle}
          </Text>
        </View>

        <View style={styles.chips}>
          {INTERESTS.map((item) => (
            <Chip
              key={item.key}
              label={getLabel(item)}
              selected={selected.has(item.key)}
              onPress={() => toggle(item.key)}
              accessibilityLabel={`${getLabel(item)} ${selected.has(item.key) ? 'sélectionné' : 'non sélectionné'}`}
            />
          ))}
        </View>

        {showError ? (
          <Text style={styles.error} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {texts.error}
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Button
          title={texts.continue}
          variant="primary"
          accessibilityLabel={texts.continue}
          onPress={handleContinue}
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  error: {
    ...typography['body-sm'],
    color: colors.ink,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.xl,
  },
});
