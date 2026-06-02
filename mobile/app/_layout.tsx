import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { colors } from '../src/design-system';

export default function RootLayout() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvasSoft },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="onboarding/language"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="onboarding/interests"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="onboarding/radius"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="opportunity/[id]"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
