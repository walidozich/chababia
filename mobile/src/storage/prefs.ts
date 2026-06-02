import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LANGUAGE: 'prefs_language',
  INTERESTS: 'prefs_interests',
  RADIUS: 'prefs_radius',
  ONBOARDING_DONE: 'prefs_onboarding_done',
  CACHED_OPPORTUNITIES: 'cache_opportunities',
  CACHED_OPPORTUNITIES_TS: 'cache_opportunities_ts',
  TICKETS: 'tickets',
} as const;

export async function getLanguage(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.LANGUAGE);
}

export async function setLanguage(lang: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
}

export async function getInterests(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.INTERESTS);
  return raw ? JSON.parse(raw) : [];
}

export async function setInterests(interests: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.INTERESTS, JSON.stringify(interests));
}

export async function getRadius(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.RADIUS);
  return raw ? parseInt(raw, 10) : 5000;
}

export async function setRadius(radius: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.RADIUS, String(radius));
}

export async function isOnboardingDone(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return raw === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

export async function getCachedOpportunities<T>(): Promise<{ data: T | null; timestamp: number | null }> {
  const [data, ts] = await Promise.all([
    AsyncStorage.getItem(KEYS.CACHED_OPPORTUNITIES),
    AsyncStorage.getItem(KEYS.CACHED_OPPORTUNITIES_TS),
  ]);
  return {
    data: data ? JSON.parse(data) : null,
    timestamp: ts ? parseInt(ts, 10) : null,
  };
}

export async function setCachedOpportunities<T>(data: T): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(KEYS.CACHED_OPPORTUNITIES, JSON.stringify(data)),
    AsyncStorage.setItem(KEYS.CACHED_OPPORTUNITIES_TS, String(Date.now())),
  ]);
}

export async function getTickets<T>(): Promise<T[]> {
  const raw = await AsyncStorage.getItem(KEYS.TICKETS);
  return raw ? JSON.parse(raw) : [];
}

export async function setTickets<T>(tickets: T[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
}
