import { Stack } from 'expo-router';
import { colors } from '@/src/design-system';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="register" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="language" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="radius" />
    </Stack>
  );
}
