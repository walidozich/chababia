import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Routes, Route } from 'react-router-dom'

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-xl">
      <div className="bento-card w-full max-w-md text-center">
        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">
          Chababia Dashboard
        </p>
        <h1 className="mt-2 text-headline-md font-extrabold text-on-surface">{label}</h1>
        <p className="mt-3 text-body-sm text-on-surface-variant">Phase 0 — scaffold complet ✓</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<ComingSoon label="Tableau de bord" />} />
        <Route path="/login" element={<ComingSoon label="Connexion" />} />
        <Route path="*" element={<ComingSoon label="Page introuvable" />} />
      </Routes>
    </BrowserRouter>
  )
}
