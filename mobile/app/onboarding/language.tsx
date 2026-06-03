import { View, Text, StyleSheet, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/Button';
import { typography, spacing, colors } from '@/src/design-system';
import { availableLocales, type Locale } from '@/src/i18n';
import { useLocale } from '@/src/hooks/useLocale';

export default function LanguageScreen() {
  const { locale, setLocale } = useLocale();
  const t = (_locale: Locale) => ({
    title:
      _locale === 'fr'
        ? 'Bienvenue sur Chababia'
        : _locale === 'ar'
          ? 'مرحباً بك في شابابيا'
          : 'ⴰⵏⵙⵓⴼ ⵖⴻⵔ Chababia',
    subtitle:
      _locale === 'fr'
        ? 'Choisis ta langue'
        : _locale === 'ar'
          ? 'اختر لغتك'
          : 'ⵙⵟⴼ ⵜⵓⵜⵍⴰⵢⵜ ⵏⵏⴻⴽ',
    continue: _locale === 'fr' ? 'Continuer' : _locale === 'ar' ? 'متابعة' : 'ⴽⴻⵎⵎⴻⵍ',
  });

  const texts = t(locale);

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
    router.push('/onboarding/interests');
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
  buttons: {
    gap: spacing.lg,
  },
  langButton: {
    alignSelf: 'stretch',
  },
  footer: {
    padding: spacing.xl,
  },
});
