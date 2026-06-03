import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { applyTheme, getStoredTheme } from '@/lib/theme'
import App from './App'
import '@/styles/globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

applyTheme(getStoredTheme())

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
