import { useEffect } from 'react'
import { View, ActivityIndicator, I18nManager } from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/src/design-system'
import { getPref, keys } from '@/src/storage/prefs'
import { pb } from '@/src/api/client'
import type { Locale } from '@/src/i18n'

export default function Index() {
  useEffect(() => {
    getPref<Locale>(keys.locale).then((locale) => {
      if (locale === 'ar') {
        I18nManager.allowRTL(true)
        I18nManager.forceRTL(true)
      }

      if (pb.authStore.isValid) {
        router.replace('/(tabs)')
        return
      }

      router.replace('/onboarding/language' as never)
    })
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.canvas }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}
