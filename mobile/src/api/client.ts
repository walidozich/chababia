import PocketBase, { AsyncAuthStore } from 'pocketbase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PB_URL = process.env.EXPO_PUBLIC_PB_URL ?? 'http://localhost:8090'

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
  initial: AsyncStorage.getItem('pb_auth'),
  clear: async () => AsyncStorage.removeItem('pb_auth'),
})

export const pb = new PocketBase(PB_URL, store)
pb.autoCancellation(false)
