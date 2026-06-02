import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

export async function getUserToken(): Promise<string> {
  let token = await SecureStore.getItemAsync('user_token');
  if (!token) {
    token = `tok_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
    await SecureStore.setItemAsync('user_token', token);
  }
  return token;
}
