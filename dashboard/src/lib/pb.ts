import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_PB_URL as string

if (!pbUrl) {
  throw new Error('VITE_PB_URL is not defined. Copy .env.example to .env and set the value.')
}

export const pb = new PocketBase(pbUrl)
