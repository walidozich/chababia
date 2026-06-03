import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { fontAssets, colors } from '@/src/design-system';
import 'react-native-reanimated';

export default function RootLayout() {
  const [fontsLoaded] = Font.useFonts(fontAssets);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            headerShown: true,
            headerStyle: { backgroundColor: colors.canvas },
            headerTintColor: colors.ink,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
