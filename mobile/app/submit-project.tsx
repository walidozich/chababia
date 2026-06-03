import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TextInput as RNTextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/src/components/Button'
import { SectionHeader } from '@/src/components/SectionHeader'
import { typography, spacing } from '@/src/design-system'
import { pb } from '@/src/api/client'
import { useLocale } from '@/src/hooks/useLocale'
import { useTheme } from '@/src/theme/ThemeContext'

export default function SubmitProjectScreen() {
  const { locale } = useLocale()
  const { colors } = useTheme()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [neededSupport, setNeededSupport] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !phone.trim()) {
      setError(locale === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'ⵙⵙⵓⵜⵔⵖ ⵛⴰⵔⴰ ⴽⵓⵍⵍⵓ ⵉⵖⴱⵓⵍⴰ ⵢⴻⵇⵇⵉⵎⴻⵏ')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await pb.collection('project_submissions').create({
        user: pb.authStore.record?.id,
        project_title: title.trim(),
        commune: pb.authStore.record?.commune ?? '',
        short_description: description.trim(),
        needed_support: neededSupport.trim(),
        contact_phone: phone.trim(),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }

    setSubmitting(false)
  }

  const titleLabel = locale === 'fr' ? 'Soumettre un projet' : locale === 'ar' ? 'تقديم مشروع' : 'ⴰⵣⵏ ⴰⵙⴻⵏⴼⴰⵔ'
  const projectTitle = locale === 'fr' ? 'Titre du projet' : locale === 'ar' ? 'عنوان المشروع' : 'ⴰⵣⵡⵉⵍ ⵏ ⵓⵙⴻⵏⴼⴰⵔ'
  const projectDesc = locale === 'fr' ? 'Description' : locale === 'ar' ? 'الوصف' : 'ⴰⴳⵍⴰⵎ'
  const supportLabel = locale === 'fr' ? 'Soutien nécessaire' : locale === 'ar' ? 'الدعم المطلوب' : 'ⵜⴰⵍⵍⴰⵍⵜ ⵉⵇⵇⵉⵎⴻⵏ'
  const phoneLabel = locale === 'fr' ? 'Téléphone' : locale === 'ar' ? 'الهاتف' : 'ⵜⵉⵍⵉⴼⵓⵏ'
  const submitLabel = locale === 'fr' ? 'Envoyer' : locale === 'ar' ? 'إرسال' : 'ⴰⵣⵏ'
  const successMsg = locale === 'fr' ? 'Projet soumis avec succès !' : locale === 'ar' ? 'تم تقديم المشروع بنجاح!' : 'ⵢⴻⵜⵜⵡⴰⵣⵏ ⵓⵙⴻⵏⴼⴰⵔ ⵙ ⵓⴱⵖⵓⵔ!'

  if (!pb.authStore.isValid) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.ink }]} maxFontSizeMultiplier={1.3}>
            {locale === 'fr' ? 'Connectez-vous pour soumettre un projet' : locale === 'ar' ? 'سجل الدخول لتقديم مشروع' : 'ⵇⵇⵉⵎ ⴰⴷ ⵜⴰⵣⵏⴻⴷ ⴰⵙⴻⵏⴼⴰⵔ'}
          </Text>
          <View style={styles.buttonWrap}>
            <Button title={locale === 'fr' ? 'Se connecter' : locale === 'ar' ? 'تسجيل الدخول' : 'ⴰⴷ ⴽⴻⵛⵎⴻⴷ'} variant="primary" accessibilityLabel="Se connecter" onPress={() => router.push('/onboarding/auth')} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (success) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <View style={styles.empty}>
          <Text style={[styles.successText, { color: colors.positive }]} maxFontSizeMultiplier={1.3}>{successMsg}</Text>
          <View style={styles.buttonWrap}>
            <Button title={locale === 'fr' ? 'Retour' : locale === 'ar' ? 'رجوع' : 'ⵖⴻⵔ ⴷⴻⴼⴼⵉⵔ'} variant="secondary" accessibilityLabel="Retour" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <SectionHeader title={titleLabel} accessibilityLabel={titleLabel} />

          {error ? (
            <View style={[styles.errorBanner, { backgroundColor: '#fde8e8', borderColor: colors.negative }]}>
              <Text style={[styles.errorText, { color: colors.negative }]} maxFontSizeMultiplier={1.3}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{projectTitle} *</Text>
            <RNTextInput
              accessibilityLabel={projectTitle}
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.ink }]}
              placeholderTextColor={colors.mute}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{projectDesc} *</Text>
            <RNTextInput
              accessibilityLabel={projectDesc}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[styles.input, styles.textarea, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.ink }]}
              placeholderTextColor={colors.mute}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{supportLabel}</Text>
            <RNTextInput
              accessibilityLabel={supportLabel}
              value={neededSupport}
              onChangeText={setNeededSupport}
              style={[styles.input, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.ink }]}
              placeholderTextColor={colors.mute}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{phoneLabel} *</Text>
            <RNTextInput
              accessibilityLabel={phoneLabel}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.ink }]}
              placeholderTextColor={colors.mute}
            />
          </View>

          <View style={styles.buttonWrap}>
            <Button
              title={submitting ? '' : submitLabel}
              variant="primary"
              accessibilityLabel={submitLabel}
              onPress={handleSubmit}
              disabled={submitting}
            />
            {submitting ? <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} /> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography['body-md'], textAlign: 'center', marginBottom: spacing.lg },
  successText: { ...typography['body-md-strong'], textAlign: 'center', marginBottom: spacing.lg, fontSize: 18 },
  errorBanner: { borderRadius: 11, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  errorText: { ...typography['body-sm'], textAlign: 'center' },
  field: { marginBottom: spacing.lg },
  label: { ...typography['body-sm-strong'], marginBottom: spacing.sm },
  input: {
    ...typography['body-md'],
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textarea: { minHeight: 120 },
  buttonWrap: { marginTop: spacing.md },
  spinner: { marginTop: spacing.sm },
})
