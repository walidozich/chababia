import { View, StyleSheet, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingFrame } from '@/src/components/OnboardingFrame';
import { Button } from '@/src/components/Button';
import { colors, spacing } from '@/src/design-system';
import { availableLocales, type Locale } from '@/src/i18n';
import { useLocale } from '@/src/hooks/useLocale';
import { t } from '@/src/i18n';

export default function LanguageScreen() {
  const { locale, setLocale } = useLocale();

  const texts = {
    title: t(locale, 'onboarding.language.title'),
    subtitle: t(locale, 'onboarding.language.subtitle'),
    continue: t(locale, 'onboarding.language.continue'),
  };

  const handleSelectLanguage = async (code: Locale) => {
    await setLocale(code);
    if (code === 'ar') {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  };

  const handleContinue = () => {
    router.push('/onboarding/auth');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingFrame
        step={1}
        totalSteps={4}
        title={texts.title}
        subtitle={texts.subtitle}
        accessibilityLabel="Onboarding langue"
        hideProgress
        footer={
          <Button
            title={texts.continue}
            variant="primary"
            accessibilityLabel={texts.continue}
            onPress={handleContinue}
          />
        }
      >
        <View style={styles.buttons}>
          {availableLocales.map(({ code, nativeLabel }) => (
            <Button
              key={code}
              title={nativeLabel}
              variant={locale === code ? 'primary' : 'tertiary'}
              accessibilityLabel={`Sélectionner ${nativeLabel}`}
              onPress={() => handleSelectLanguage(code)}
              style={styles.langButton}
            />
          ))}
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
  buttons: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  langButton: {
    alignSelf: 'stretch',
  },
});
