import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'chababia_';

const keys = {
  locale: `${PREFIX}locale`,
  radius: `${PREFIX}radius`,
  interests: `${PREFIX}interests`,
  onboardingDone: `${PREFIX}onboarding_done`,
  cacheOpportunities: `${PREFIX}cache_opportunities`,
  tickets: `${PREFIX}tickets`,
} as const;

export async function getPref<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setPref<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail — prefs are non-critical
  }
}

export async function removePref(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // silently fail
  }
}

export { keys };
