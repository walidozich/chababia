import { Outlet } from 'react-router-dom'
import { useIsFetching } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

function GlobalFetchIndicator() {
  const count = useIsFetching()
  if (count === 0) return null
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/10">
      <div className="h-full w-1/2 animate-fetch-bar bg-primary" />
    </div>
  )
}

export function AppLayout() {
  return (
    <TooltipProvider>
      <GlobalFetchIndicator />
      <div className="flex h-screen overflow-hidden bg-surface">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-surface p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
