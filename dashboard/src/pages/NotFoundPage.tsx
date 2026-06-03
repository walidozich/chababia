import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-display-xl font-extrabold text-primary">404</p>
      <h1 className="text-headline-md font-bold text-on-surface">Page introuvable</h1>
      <p className="text-body-md text-on-surface-variant">
        Cette page n'existe pas ou vous n'y avez pas accès.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  )
}
