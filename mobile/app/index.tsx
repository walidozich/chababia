import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/src/design-system';
import { getPref, keys } from '@/src/storage/prefs';

export default function Index() {
  useEffect(() => {
    getPref<boolean>(keys.onboardingDone).then((done) => {
      if (done) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/language');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.canvas }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
