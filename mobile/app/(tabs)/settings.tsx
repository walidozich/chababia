import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, I18nManager, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Chip } from '@/src/components/Chip';
import { SectionHeader } from '@/src/components/SectionHeader';
import { typography, spacing } from '@/src/design-system';
import { availableLocales, type Locale } from '@/src/i18n';
import { useLocale } from '@/src/hooks/useLocale';
import { useTheme } from '@/src/theme/ThemeContext';
import { getPref, setPref, removePref, keys } from '@/src/storage/prefs'
import { pb } from '@/src/api/client'

const RADIUS_OPTIONS = [
  { value: 1000, fr: '1 km', ar: '1 كم', tzm: '1 ⴽⵎ' },
  { value: 2000, fr: '2 km', ar: '2 كم', tzm: '2 ⴽⵎ' },
  { value: 5000, fr: '5 km', ar: '5 كم', tzm: '5 ⴽⵎ' },
];

const INTERESTS = [
  { key: 'sport', fr: 'Sport', ar: 'رياضة', tzm: 'ⵙⴱⵓⵕⵜ' },
  { key: 'culture', fr: 'Culture', ar: 'ثقافة', tzm: 'ⵉⴷⵍⴻⵙ' },
  { key: 'formation', fr: 'Formation', ar: 'تكوين', tzm: 'ⴰⵙⴻⵍⵎⴻⴷ' },
  { key: 'musique', fr: 'Musique', ar: 'موسيقى', tzm: 'ⴰⵥⴰⵡⴰⵏ' },
  { key: 'ecologie', fr: 'Écologie', ar: 'بيئة', tzm: 'ⵜⴰⵡⵏⵏⴰⴹⵜ' },
  { key: 'benevolat', fr: 'Bénévolat', ar: 'تطوع', tzm: 'ⴰⵙⴻⵡⵡⴰⵚ' },
];

export default function SettingsScreen() {
  const { locale, setLocale } = useLocale();
  const { isDark, toggleDarkMode, colors } = useTheme();
  const [radius, setRadius] = useState<number>(5000);
  const [interests, setInterests] = useState<string[]>([]);

  useState(() => {
    Promise.all([getPref<number>(keys.radius), getPref<string[]>(keys.interests)]).then(
      ([r, i]) => { if (r) setRadius(r); if (i) setInterests(i); },
    );
  });

  const handleLanguageChange = useCallback(async (code: Locale) => {
    await setLocale(code);
    if (code === 'ar') { I18nManager.allowRTL(true); I18nManager.forceRTL(true); }
    else { I18nManager.allowRTL(false); I18nManager.forceRTL(false); }
  }, [setLocale]);

  const handleRadiusChange = useCallback(async (value: number) => { setRadius(value); await setPref(keys.radius, value); }, []);
  const handleInterestToggle = useCallback(async (key: string) => { setInterests((prev) => { const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]; setPref(keys.interests, next); return next; }); }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      locale === 'fr' ? 'Déconnexion' : locale === 'ar' ? 'تسجيل الخروج' : 'ⴰⵙⴻⵏⵣⴻⵔ',
      locale === 'fr' ? 'Voulez-vous vraiment vous déconnecter ?' : locale === 'ar' ? 'هل تريد حقاً تسجيل الخروج؟' : 'ⴷⴰⵏⵙⴰ ⴰⴷ ⵜⵙⴻⵏⵣⴻⵔⴻⴷ ⵏⵉⵖ?',
      [
        { text: locale === 'fr' ? 'Annuler' : locale === 'ar' ? 'إلغاء' : 'ⵙⴻⴼⵙⵅ', style: 'cancel' },
        { text: locale === 'fr' ? 'Déconnexion' : locale === 'ar' ? 'تسجيل الخروج' : 'ⴰⵙⴻⵏⵣⴻⵔ', style: 'destructive', onPress: async () => {
          pb.authStore.clear()
          await removePref(keys.onboardingDone)
          router.replace('/onboarding/language' as never)
        } },
      ],
    )
  }, [locale])

  const handleResetOnboarding = useCallback(() => {
    Alert.alert(
      locale === 'fr' ? 'Réinitialiser' : locale === 'ar' ? 'إعادة تعيين' : 'ⴰⵙⵙⵉⵡⴻⴹ',
      locale === 'fr' ? "L'onboarding sera relancé au prochain démarrage. Continuer ?" : locale === 'ar' ? 'سيتم إعادة تشغيل الإعداد الأولي عند الفتح التالي. متابعة؟' : 'ⴰⴷ ⵢⴻⴱⴷⵓ ⵓⵙⴻⵍⵎⴻⴷ ⵖⴻⵔ ⵜⵉⴽⴽⴻⵍⵜ ⵢⴻⴹⴹⴰⵏ. ⴽⴻⵎⵎⴻⵍ?',
      [
        { text: locale === 'fr' ? 'Annuler' : locale === 'ar' ? 'إلغاء' : 'ⵙⴻⴼⵙⵅ', style: 'cancel' },
        { text: locale === 'fr' ? 'Réinitialiser' : locale === 'ar' ? 'إعادة تعيين' : 'ⴰⵙⵙⵉⵡⴻⴹ', style: 'destructive', onPress: async () => { await removePref(keys.onboardingDone); router.replace('/onboarding/language' as never); } },
      ],
    );
  }, [locale]);

  const getRadiusLabel = (opt: (typeof RADIUS_OPTIONS)[number]) => locale === 'ar' ? opt.ar : locale === 'tzm' ? opt.tzm : opt.fr;
  const getInterestLabel = (item: (typeof INTERESTS)[number]) => locale === 'ar' ? item.ar : locale === 'tzm' ? item.tzm : item.fr;
  const title = locale === 'fr' ? 'Paramètres' : locale === 'ar' ? 'الإعدادات' : 'ⵉⵎⵙⵖⴰⵍ';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionHeader title={title} accessibilityLabel={title} />

        <Card variant="content" style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>
                {locale === 'fr' ? 'Mode sombre' : locale === 'ar' ? 'الوضع الداكن' : 'ⴰⵙⴽⴰⵍ ⴰⵎⴻⵣⴳⵉⴷⵓ'}
              </Text>
              <Text style={[styles.sectionDesc, { color: colors.body }]} maxFontSizeMultiplier={1.3}>
                {locale === 'fr' ? 'Active le thème vert foncé' : locale === 'ar' ? 'تفعيل المظهر الأخضر الداكن' : 'ⵙⵔⵎⴻⴷ ⴰⵣⵡⵉⵍ ⴰⵣⴻⴳⵣⴰⵡ ⴰⵎⵣⴳⵉⴷⵓ'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d9e0c7', true: '#99e65f' }}
              thumbColor={isDark ? '#163300' : '#ffffff'}
              accessibilityLabel={locale === 'fr' ? 'Mode sombre' : locale === 'ar' ? 'الوضع الداكن' : 'ⴰⵙⴽⴰⵍ ⴰⵎⴻⵣⴳⵉⴷⵓ'}
            />
          </View>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'Langue' : locale === 'ar' ? 'اللغة' : 'ⵜⵓⵜⵍⴰⵢⵜ'}</Text>
          <View style={styles.chips}>{availableLocales.map(({ code, nativeLabel }) => <Chip key={code} label={nativeLabel} selected={locale === code} onPress={() => handleLanguageChange(code)} accessibilityLabel={`${nativeLabel}`} />)}</View>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'Rayon de recherche' : locale === 'ar' ? 'نطاق البحث' : 'ⴰⴱⵄⴰⴷ ⵏ ⵓⵇⴻⵍⵍⴰⴱ'}</Text>
          <View style={styles.chips}>{RADIUS_OPTIONS.map((opt) => <Chip key={opt.value} label={getRadiusLabel(opt)} selected={radius === opt.value} onPress={() => handleRadiusChange(opt.value)} accessibilityLabel={getRadiusLabel(opt)} />)}</View>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? "Centres d'intérêt" : locale === 'ar' ? 'مجالات الاهتمام' : 'ⵉⵖⴰⵡⴰⵙⴻⵏ ⵏ ⵍⴻⵀⵡⴰ'}</Text>
          <View style={styles.chips}>{INTERESTS.map((item) => <Chip key={item.key} label={getInterestLabel(item)} selected={interests.includes(item.key)} onPress={() => handleInterestToggle(item.key)} accessibilityLabel={getInterestLabel(item)} />)}</View>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'Onboarding' : locale === 'ar' ? 'الإعداد الأولي' : 'ⴰⵙⴻⵍⵎⴻⴷ'}</Text>
          <Text style={[styles.sectionDesc, { color: colors.body }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? "Relancer le questionnaire d'accueil" : locale === 'ar' ? 'إعادة تشغيل استبيان الترحيب' : 'ⴰⵙⴽⴰⵔ ⵏ ⵓⵙⴻⵙⵜⴰⵏ ⵏ ⵓⵏⵙⵓⴼ'}</Text>
          <View style={styles.buttonRow}><Button title={locale === 'fr' ? 'Réinitialiser' : locale === 'ar' ? 'إعادة تعيين' : 'ⴰⵙⵙⵉⵡⴻⴹ'} variant="tertiary" accessibilityLabel="Réinitialiser" onPress={handleResetOnboarding} /></View>
        </Card>

        <Card variant="content" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'À propos' : locale === 'ar' ? 'حول' : 'ⵖⴻⴼ'}</Text>
          <Text style={[styles.sectionDesc, { color: colors.body }]} maxFontSizeMultiplier={1.3}>Chababia v1.0.0 — ODEJ YouthConnect</Text>
          <Text style={[styles.sectionDesc, { color: colors.body }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'Connecte les jeunes Algériens aux opportunités ODEJ.' : locale === 'ar' ? 'يربط الشباب الجزائري بفرص ODEJ.' : 'ⵢⴻⵣⴷⴰⵢ ⵉⵍⵎⴰⵣⵢⴻⵏ ⵉⵣⴻⴷⵣⴰⵢⵔⵉⵢⴻⵏ ⵙ ⵜⵉⵖⴻⵍⵍⴰⵙⵉⵏ ⵏ ODEJ.'}</Text>
        </Card>

        {pb.authStore.isValid ? (
          <Card variant="content" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>{locale === 'fr' ? 'Compte' : locale === 'ar' ? 'الحساب' : 'ⴰⵎⵉⴹⴰⵏ'}</Text>
            <Text style={[styles.sectionDesc, { color: colors.body }]} maxFontSizeMultiplier={1.3}>{pb.authStore.record?.email ?? ''}</Text>
            <View style={styles.buttonRow}><Button title={locale === 'fr' ? 'Se déconnecter' : locale === 'ar' ? 'تسجيل الخروج' : 'ⴰⵙⴻⵏⵣⴻⵔ'} variant="tertiary" accessibilityLabel="Se déconnecter" onPress={handleLogout} /></View>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing['3xl'] },
  section: { marginHorizontal: spacing.xl },
  sectionTitle: { ...typography['body-md-strong'], marginBottom: spacing.sm },
  sectionDesc: { ...typography['body-sm'], marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { flex: 1, marginRight: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  buttonRow: { marginTop: spacing.sm },
});
