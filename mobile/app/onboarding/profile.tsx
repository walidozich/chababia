import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { OnboardingFrame } from '@/src/components/OnboardingFrame';
import { Button } from '@/src/components/Button';
import { TextInput } from '@/src/components/TextInput';
import { colors, spacing, typography } from '@/src/design-system';
import { useLocale } from '@/src/hooks/useLocale';
import { setPref, keys } from '@/src/storage/prefs';
import { t } from '@/src/i18n';

type SimpleIconProps = { size?: number; color?: string; strokeWidth?: number };

function UserIcon({ size = 24, color = '#000', strokeWidth = 2 }: SimpleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function DatePickerField({
  value,
  placeholder,
  accessibilityLabel,
  onDateChange,
}: {
  value: Date | null;
  placeholder: string;
  accessibilityLabel: string;
  onDateChange: (d: Date) => void;
}) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) onDateChange(selectedDate);
      return;
    }
    if (selectedDate) onDateChange(selectedDate);
  };

  const formatted = value
    ? value.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={() => setShow(true)}
        style={styles.dateShell}
      >
        <Text style={[styles.dateText, !value && styles.datePlaceholder]} maxFontSizeMultiplier={1.2}>
          {value ? formatted : placeholder}
        </Text>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#5e6458" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Path d="M16 2v4M8 2v4M3 10h18" />
        </Svg>
      </Pressable>

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={value ?? new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
          onChange={handleChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <View style={[styles.pickerContainer, !show && styles.pickerHidden]}>
          <View style={styles.pickerHeader}>
            <Pressable onPress={() => setShow(false)} hitSlop={12}>
              <Text style={styles.pickerDone} maxFontSizeMultiplier={1.2}>OK</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={value ?? new Date(2000, 0, 1)}
            mode="date"
            display="spinner"
            themeVariant="dark"
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
            onChange={handleChange}
            textColor="#9fe870"
          />
        </View>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const { locale } = useLocale();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const labels = {
    title: t(locale, 'onboarding.profile.title'),
    subtitle: t(locale, 'onboarding.profile.subtitle'),
    firstnameLabel: t(locale, 'onboarding.profile.firstname_label'),
    firstnamePlaceholder: t(locale, 'onboarding.profile.firstname_placeholder'),
    lastnameLabel: t(locale, 'onboarding.profile.lastname_label'),
    lastnamePlaceholder: t(locale, 'onboarding.profile.lastname_placeholder'),
    birthdateLabel: t(locale, 'onboarding.profile.birthdate_label'),
    birthdatePlaceholder: t(locale, 'onboarding.profile.birthdate_placeholder'),
    continue: t(locale, 'onboarding.profile.continue'),
  };

  const handleContinue = async () => {
    await setPref(keys.profile, {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      birthdate: birthdate?.toISOString() ?? '',
    });
    router.push('/onboarding/interests');
  };

  const canContinue = firstname.trim().length > 0 && lastname.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <OnboardingFrame
          step={2}
          totalSteps={4}
          title={labels.title}
          subtitle={labels.subtitle}
          accessibilityLabel="Onboarding profil"
          onBack={() => router.back()}
          footer={
            <Button
              title={labels.continue}
              variant="primary"
              accessibilityLabel={labels.continue}
              onPress={handleContinue}
              disabled={!canContinue}
              style={!canContinue && styles.ctaDisabled}
            />
          }
        >
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label} maxFontSizeMultiplier={1.2}>
                {labels.firstnameLabel}
              </Text>
              <TextInput
                accessibilityLabel={labels.firstnameLabel}
                placeholder={labels.firstnamePlaceholder}
                value={firstname}
                onChangeText={setFirstname}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label} maxFontSizeMultiplier={1.2}>
                {labels.lastnameLabel}
              </Text>
              <TextInput
                accessibilityLabel={labels.lastnameLabel}
                placeholder={labels.lastnamePlaceholder}
                value={lastname}
                onChangeText={setLastname}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label} maxFontSizeMultiplier={1.2}>
                {labels.birthdateLabel}
              </Text>
              <DatePickerField
                value={birthdate}
                placeholder={labels.birthdatePlaceholder}
                accessibilityLabel={labels.birthdateLabel}
                onDateChange={setBirthdate}
              />
            </View>
          </ScrollView>
        </OnboardingFrame>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    paddingBottom: spacing.md,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography['body-sm-strong'],
    color: '#222222',
    marginBottom: spacing.sm,
  },
  dateShell: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#d9e0c7',
    backgroundColor: '#f9f7f1',
    borderRadius: 11,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#60666e',
    ...typography['body-md'],
    paddingVertical: 11,
  },
  datePlaceholder: {
    color: '#60666e',
  },
  pickerContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#163300',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9fe870',
    overflow: 'hidden',
  },
  pickerHidden: {
    height: 0,
    borderWidth: 0,
    marginTop: 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  pickerDone: {
    ...typography['body-md-strong'],
    color: '#9fe870',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
});
