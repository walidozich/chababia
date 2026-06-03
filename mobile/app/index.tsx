import { useEffect } from 'react';
import { View, ActivityIndicator, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/src/design-system';
import { getPref, removePref, keys } from '@/src/storage/prefs';
import type { Locale } from '@/src/i18n';

export default function Index() {
  useEffect(() => {
    if (__DEV__) {
      removePref(keys.onboardingDone).then(() => {
        router.replace('/onboarding/language');
      });
      return;
    }

    getPref<Locale>(keys.locale).then((locale) => {
      if (locale === 'ar') {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }

      getPref<boolean>(keys.onboardingDone).then((done) => {
        if (done) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/language');
        }
      });
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.canvas }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
