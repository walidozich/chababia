import { useMemo, useState } from 'react'
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Pressable, TextInput as RNTextInput, useWindowDimensions,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Eye, EyeOff } from 'lucide-react-native'
import { ClientResponseError } from 'pocketbase'
import { spacing, typography } from '@/src/design-system'
import { Logo } from '@/src/components/Logo'
import { useLocale } from '@/src/hooks/useLocale'
import { useTheme } from '@/src/theme/ThemeContext'
import { t } from '@/src/i18n'
import { pb } from '@/src/api/client'
import { setPref, keys } from '@/src/storage/prefs'

export default function AuthScreen() {
  const { width } = useWindowDimensions()
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secureEntry, setSecureEntry] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isCompact = width < 420

  const labels = useMemo(
    () => ({
      title: t(locale, 'onboarding.auth.login.title'),
      subtitle: t(locale, 'onboarding.auth.login.subtitle'),
      emailLabel: t(locale, 'onboarding.auth.login.email_label'),
      emailPlaceholder: t(locale, 'onboarding.auth.login.email_placeholder'),
      passwordLabel: t(locale, 'onboarding.auth.login.password_label'),
      passwordPlaceholder: t(locale, 'onboarding.auth.login.password_placeholder'),
      forgotPassword: t(locale, 'onboarding.auth.login.forgot_password'),
      cta: t(locale, 'onboarding.auth.login.cta'),
      or: t(locale, 'onboarding.auth.login.or'),
      noAccount: t(locale, 'onboarding.auth.login.no_account'),
      createAccount: t(locale, 'onboarding.auth.login.create_account'),
      showPassword: locale === 'fr' ? 'Afficher le mot de passe' : locale === 'ar' ? 'إظهار كلمة المرور' : 'ⵎⴰⵍ ⵜⴰⴳⵓⵔⴰⵢⵜ',
      hidePassword: locale === 'fr' ? 'Masquer le mot de passe' : locale === 'ar' ? 'إخفاء كلمة المرور' : 'ⵖⴼⵓ ⵜⴰⴳⵓⵔⴰⵢⵜ',
      invalid: locale === 'fr' ? 'Email ou mot de passe incorrect' : locale === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'ⵢⵉⵖⴻⵔⴷⴰ ⵉⵎⴰⵢⵍ ⵏⴻⵖ ⵜⴰⴳⵓⵔⴰⵢⵜ',
    }),
    [locale],
  )

  const handleLogin = async () => {
    setError(null)
    setSubmitting(true)

    try {
      await pb.collection('users').authWithPassword(email, password)
      await setPref(keys.onboardingDone, true)
      router.replace('/(tabs)')
    } catch (err) {
      if (err instanceof ClientResponseError) {
        setError(err.message || labels.invalid)
      } else {
        setError(err instanceof Error ? err.message : labels.invalid)
      }
    }

    setSubmitting(false)
  }

  const canSubmit = email.length > 0 && password.length > 0 && !submitting

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.appBg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]}>
          <View style={[styles.page, isCompact ? styles.pageCompact : styles.pageWide]}>
            <View style={styles.brandRow}>
              <View style={styles.logoWrap}>
                <Logo />
              </View>
              <Text style={[styles.brandText, { color: colors.brandGreen }]} maxFontSizeMultiplier={1.2}>
                Chababia
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, shadowColor: colors.cardShadow }]}>
              <Text style={[styles.title, { color: colors.textTitle }]} maxFontSizeMultiplier={1.2}>{labels.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSubtitle }]} maxFontSizeMultiplier={1.2}>{labels.subtitle}</Text>

              {error ? (
                  <View style={[styles.errorBanner, { backgroundColor: '#fde8e8', borderColor: colors.negative }]}>
                  <Text style={[styles.errorText, { color: colors.negative }]} maxFontSizeMultiplier={1.3}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textLabel }]} maxFontSizeMultiplier={1.2}>{labels.emailLabel}</Text>
                <View style={[styles.inputShell, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                  <RNTextInput
                    accessibilityLabel={labels.emailLabel}
                    placeholder={labels.emailPlaceholder}
                    placeholderTextColor={colors.inputText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, { color: colors.inputText }]}
                  />
                  <Mail size={18} color={colors.inputIcon} strokeWidth={1.9} />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.passwordRow}>
                  <Text style={[styles.label, { color: colors.textLabel }]} maxFontSizeMultiplier={1.2}>{labels.passwordLabel}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={labels.forgotPassword} onPress={() => router.push('/onboarding/register')}>
                    <Text style={[styles.forgotPassword, { color: colors.brandLink }]} maxFontSizeMultiplier={1.2}>{labels.forgotPassword}</Text>
                  </Pressable>
                </View>
                <View style={[styles.inputShell, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                  <RNTextInput
                    accessibilityLabel={labels.passwordLabel}
                    placeholder={labels.passwordPlaceholder}
                    placeholderTextColor={colors.inputText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureEntry}
                    style={[styles.input, { color: colors.inputText }]}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={secureEntry ? labels.showPassword : labels.hidePassword}
                    onPress={() => setSecureEntry((v) => !v)}
                    hitSlop={8}
                  >
                    {secureEntry ? <Eye size={18} color={colors.inputIcon} strokeWidth={1.9} /> : <EyeOff size={18} color={colors.inputIcon} strokeWidth={1.9} />}
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={labels.cta}
                onPress={handleLogin}
                disabled={!canSubmit}
                style={({ pressed }) => [styles.loginButton, { backgroundColor: canSubmit ? colors.btnPrimaryBg : colors.mute, shadowColor: colors.btnPrimaryShadow }, pressed && styles.loginButtonPressed]}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.btnPrimaryText} />
                ) : (
                  <Text style={[styles.loginButtonText, { color: colors.btnPrimaryText }]} maxFontSizeMultiplier={1.2}>{labels.cta}</Text>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                <Text style={[styles.dividerText, { color: colors.dividerText }]} maxFontSizeMultiplier={1.2}>{labels.or}</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
              </View>

              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: colors.textFooter }]} maxFontSizeMultiplier={1.2}>{labels.noAccount}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={labels.createAccount} onPress={() => router.push('/onboarding/register')}>
                  <Text style={[styles.footerLink, { color: colors.brandLinkFg }]} maxFontSizeMultiplier={1.2}>{labels.createAccount}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing['2xl'] },
  scrollContentCompact: { paddingHorizontal: spacing.lg },
  page: { width: '100%', alignItems: 'flex-start' },
  pageCompact: { maxWidth: 350 },
  pageWide: { maxWidth: 360 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginLeft: spacing.xs },
  logoWrap: { width: 74, height: 22, justifyContent: 'center', marginRight: 2 },
  brandText: { fontFamily: 'Stack Sans Notch', fontSize: 34, lineHeight: 36, fontWeight: '800' },
  card: { width: '100%', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 22, borderWidth: 1, shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 2 },
  title: { ...typography['display-sm'], marginBottom: 6, fontSize: 28, lineHeight: 32 },
  subtitle: { ...typography['body-md'], marginBottom: 18 },
  errorBanner: { borderRadius: 11, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  errorText: { ...typography['body-sm'], textAlign: 'center' },
  fieldGroup: { marginBottom: 14 },
  label: { ...typography['body-sm-strong'], marginBottom: 8 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  forgotPassword: { ...typography['body-sm-strong'] },
  inputShell: { minHeight: 46, borderWidth: 1, borderRadius: 11, paddingLeft: 14, paddingRight: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, ...typography['body-md'], paddingVertical: 11, paddingRight: 10 },
  loginButton: { minHeight: 54, marginTop: 8, marginBottom: 16, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  loginButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  loginButtonText: { fontFamily: 'Stack Sans Notch', fontSize: 24, lineHeight: 28, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { ...typography['body-sm'] },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { ...typography['body-sm'] },
  footerLink: { ...typography['body-sm-strong'] },
})
