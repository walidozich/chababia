import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Font from 'expo-font'
import { StyleSheet } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fontAssets, colors } from '@/src/design-system'
import { ThemeProvider } from '@/src/theme/ThemeContext'
import { LocaleProvider } from '@/src/theme/LocaleContext'
import 'react-native-reanimated'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
      retry: 1,
    },
  },
})

export default function RootLayout() {
  const [fontsLoaded] = Font.useFonts(fontAssets);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ThemeProvider>
        <GestureHandlerRootView style={styles.root}>
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
        </GestureHandlerRootView>
      </ThemeProvider>
    </LocaleProvider>
  </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
