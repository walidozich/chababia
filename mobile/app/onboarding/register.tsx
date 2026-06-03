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

export default function RegisterScreen() {
  const { width } = useWindowDimensions()
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [secureEntry, setSecureEntry] = useState(true)
  const [secureConfirm, setSecureConfirm] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isCompact = width < 420

  const labels = useMemo(
    () => ({
      title: t(locale, 'onboarding.auth.register.title'),
      subtitle: t(locale, 'onboarding.auth.register.subtitle'),
      emailLabel: t(locale, 'onboarding.auth.register.email_label'),
      emailPlaceholder: t(locale, 'onboarding.auth.register.email_placeholder'),
      passwordLabel: t(locale, 'onboarding.auth.register.password_label'),
      passwordPlaceholder: t(locale, 'onboarding.auth.register.password_placeholder'),
      confirmPasswordLabel: t(locale, 'onboarding.auth.register.confirm_password_label'),
      confirmPasswordPlaceholder: t(locale, 'onboarding.auth.register.confirm_password_placeholder'),
      cta: t(locale, 'onboarding.auth.register.cta'),
      haveAccount: t(locale, 'onboarding.auth.register.have_account'),
      login: t(locale, 'onboarding.auth.register.login'),
      showPassword: locale === 'fr' ? 'Afficher le mot de passe' : locale === 'ar' ? 'إظهار كلمة المرور' : 'ⵎⴰⵍ ⵜⴰⴳⵓⵔⴰⵢⵜ',
      hidePassword: locale === 'fr' ? 'Masquer le mot de passe' : locale === 'ar' ? 'إخفاء كلمة المرور' : 'ⵖⴼⵓ ⵜⴰⴳⵓⵔⴰⵢⵜ',
      passwordMismatch: locale === 'fr' ? 'Les mots de passe ne correspondent pas' : locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'ⵓⵔ ⵎⵙⴰⵙⴰⵏⵜ ⵜⴰⴳⵓⵔⵉⵡⵉⵏ',
      passwordShort: locale === 'fr' ? '8 caractères minimum' : locale === 'ar' ? '8 أحرف على الأقل' : 'ⴰⵟⵟⴰⵙ ⵏ 8 ⵉⵙⴻⴽⴽⵉⵍⴻⵏ',
    }),
    [locale],
  )

  const handleRegister = async () => {
    setError(null)

    if (password !== confirmPassword) {
      setError(labels.passwordMismatch)
      return
    }

    if (password.length < 8) {
      setError(labels.passwordShort)
      return
    }

    setSubmitting(true)

    try {
      const fullName = email.split('@')[0] ?? 'Jeune'

      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: confirmPassword,
        full_name: fullName,
        role: 'youth',
        preferred_language: locale,
      })

      await pb.collection('users').authWithPassword(email, password)
      router.push('/onboarding/profile')
    } catch (err) {
      if (err instanceof ClientResponseError) {
        const fieldErrors = err.response?.data
        if (fieldErrors && typeof fieldErrors === 'object') {
          const messages = Object.values(fieldErrors as Record<string, { message: string }>)
            .map((v) => v?.message ?? '')
            .filter(Boolean)
          setError(messages.length > 0 ? messages.join('\n') : err.message)
        } else {
          setError(err.message)
        }
      } else {
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    setSubmitting(false)
  }

  const canSubmit = email.length > 0 && password.length >= 8 && confirmPassword.length >= 8 && !submitting

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.appBg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]}>
          <View style={[styles.page, isCompact ? styles.pageCompact : styles.pageWide]}>
            <View style={styles.brandRow}>
              <View style={styles.logoWrap}><Logo /></View>
              <Text style={[styles.brandText, { color: colors.brandGreen }]} maxFontSizeMultiplier={1.2}>Chababia</Text>
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
                  <RNTextInput accessibilityLabel={labels.emailLabel} placeholder={labels.emailPlaceholder} placeholderTextColor={colors.inputText} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { color: colors.inputText }]} />
                  <Mail size={18} color={colors.inputIcon} strokeWidth={1.9} />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textLabel }]} maxFontSizeMultiplier={1.2}>{labels.passwordLabel}</Text>
                <View style={[styles.inputShell, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                  <RNTextInput accessibilityLabel={labels.passwordLabel} placeholder={labels.passwordPlaceholder} placeholderTextColor={colors.inputText} value={password} onChangeText={setPassword} secureTextEntry={secureEntry} style={[styles.input, { color: colors.inputText }]} />
                  <Pressable accessibilityRole="button" accessibilityLabel={secureEntry ? labels.showPassword : labels.hidePassword} onPress={() => setSecureEntry((v) => !v)} hitSlop={8}>
                    {secureEntry ? <Eye size={18} color={colors.inputIcon} strokeWidth={1.9} /> : <EyeOff size={18} color={colors.inputIcon} strokeWidth={1.9} />}
                  </Pressable>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textLabel }]} maxFontSizeMultiplier={1.2}>{labels.confirmPasswordLabel}</Text>
                <View style={[styles.inputShell, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                  <RNTextInput accessibilityLabel={labels.confirmPasswordLabel} placeholder={labels.confirmPasswordPlaceholder} placeholderTextColor={colors.inputText} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={secureConfirm} style={[styles.input, { color: colors.inputText }]} />
                  <Pressable accessibilityRole="button" accessibilityLabel={secureConfirm ? labels.showPassword : labels.hidePassword} onPress={() => setSecureConfirm((v) => !v)} hitSlop={8}>
                    {secureConfirm ? <Eye size={18} color={colors.inputIcon} strokeWidth={1.9} /> : <EyeOff size={18} color={colors.inputIcon} strokeWidth={1.9} />}
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button" accessibilityLabel={labels.cta}
                onPress={handleRegister}
                disabled={!canSubmit}
                style={({ pressed }) => [styles.registerButton, { backgroundColor: canSubmit ? colors.btnPrimaryBg : colors.mute, shadowColor: colors.btnPrimaryShadow }, pressed && styles.registerButtonPressed]}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.btnPrimaryText} />
                ) : (
                  <Text style={[styles.registerButtonText, { color: colors.btnPrimaryText }]} maxFontSizeMultiplier={1.2}>{labels.cta}</Text>
                )}
              </Pressable>

              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: colors.textFooter }]} maxFontSizeMultiplier={1.2}>{labels.haveAccount}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={labels.login} onPress={() => router.back()}>
                  <Text style={[styles.footerLink, { color: colors.brandLinkFg }]} maxFontSizeMultiplier={1.2}>{labels.login}</Text>
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
  safeArea: { flex: 1 }, flex: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing['2xl'] },
  scrollContentCompact: { paddingHorizontal: spacing.lg },
  page: { width: '100%', alignItems: 'flex-start' }, pageCompact: { maxWidth: 350 }, pageWide: { maxWidth: 360 },
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
  inputShell: { minHeight: 46, borderWidth: 1, borderRadius: 11, paddingLeft: 14, paddingRight: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, ...typography['body-md'], paddingVertical: 11, paddingRight: 10 },
  registerButton: { minHeight: 54, marginTop: 8, marginBottom: 18, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  registerButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  registerButtonText: { fontFamily: 'Stack Sans Notch', fontSize: 24, lineHeight: 28, fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { ...typography['body-sm'] },
  footerLink: { ...typography['body-sm-strong'] },
})
