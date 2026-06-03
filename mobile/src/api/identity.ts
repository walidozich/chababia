import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

const TOKEN_KEY = 'user_token';

export async function getUserToken(): Promise<string> {
  let token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) {
    token = `tok_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
  return token;
}
