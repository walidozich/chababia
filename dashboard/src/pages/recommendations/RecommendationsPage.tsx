import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, Clock, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_SUGGESTIONS, MOCK_RECOMMENDATION_REQUESTS, MOCK_USERS } from '@/mocks'
import type { RecommendationRequest, Suggestion } from '@/types/collections'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  commune: z.string().min(2, 'Commune requise'),
  wilaya: z.string().min(2, 'Wilaya requise'),
  establishment_type: z.string().default('youth_house'),
})
type FormValues = z.infer<typeof schema>
type ApiError = '429' | '403' | '502'

const TYPE_LABELS: Record<string, string> = {
  youth_house: 'Maison de jeunes',
  youth_hostel: 'Auberge de jeunesse',
  sports_complex: 'Complexe sportif',
  youth_camp: 'Camp de jeunes',
  polyvalent_hall: 'Salle polyvalente',
  scientific_leisure_center: 'Centre loisirs scientifiques',
}

function adminName(id: string) {
  return MOCK_USERS.find((user) => user.id === id)?.full_name ?? '—'
}

function AccessDenied() {
  return (
    <div className="bento-card py-16 text-center">
      <p className="text-label-lg font-bold text-error">Accès réservé aux superadmins.</p>
    </div>
  )
}

export default function RecommendationsPage() {
  const isSuperuser = useAuthStore((state) => state.isAdmin)
  const navigate = useNavigate()
  const [results, setResults] = useState<Suggestion[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<ApiError | null>(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { commune: '', wilaya: '', establishment_type: 'youth_house' },
  })

  if (!isSuperuser) return <AccessDenied />

  function onSubmit(data: FormValues) {
    setIsLoading(true)
    setApiError(null)
    window.setTimeout(() => {
      setResults(MOCK_SUGGESTIONS)
      setIsLoading(false)
      toast.success('Suggestions générées (mock)', { description: `${data.commune}, ${data.wilaya}` })
    }, 800)
  }

  function handleCreateDraft(suggestion: Suggestion) {
    toast.success('Naviguez vers "Nouvelle activité" pour créer ce brouillon (mock)', {
      description: suggestion.title,
      action: {
        label: 'Créer',
        onClick: () => {
          void navigate('/activities/new')
        },
      },
    })
  }

  const columns: ColumnDef<RecommendationRequest>[] = [
    { accessorKey: 'commune', header: 'Commune' },
    { accessorKey: 'wilaya', header: 'Wilaya' },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'admin',
      header: 'Admin',
      cell: ({ row }) => <span className="text-on-surface-variant">{adminName(row.original.admin_user)}</span>,
    },
    {
      accessorKey: 'created',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.created), 'd MMM yyyy', { locale: fr }),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast.info('Suggestions', {
                description: `${row.original.suggestions_json.slice(0, 100)}...`,
              })
            }}
          >
            Voir JSON
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="IA Recommandations"
        description="Générer des idées d'activités à partir du contexte local"
      />

      <div className="bento-card space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-primary-on-container">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-label-lg font-bold text-on-surface">Nouvelle demande</h2>
            <p className="text-body-sm text-on-surface-variant">Les résultats restent des brouillons à valider par l'équipe.</p>
          </div>
        </div>
        <Separator />

        <form
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <FormField label="Commune" required error={errors.commune?.message}>
            <Input {...register('commune')} placeholder="Béjaïa" />
          </FormField>
          <FormField label="Wilaya" required error={errors.wilaya?.message}>
            <Input {...register('wilaya')} placeholder="Béjaïa" />
          </FormField>
          <FormField label="Type d'établissement" error={errors.establishment_type?.message}>
            <Controller control={control} name="establishment_type" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </FormField>
          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Clock className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Générer
            </Button>
          </div>
        </form>
      </div>

      {apiError === '429' && (
        <div className="bento-card flex items-start gap-3 border border-error/30 bg-error/5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div>
            <p className="font-semibold text-error">Limite atteinte</p>
            <p className="text-body-sm text-on-surface-variant">10 requêtes par compte. Contactez un superadmin.</p>
          </div>
        </div>
      )}
      {apiError === '403' && (
        <div className="bento-card flex items-start gap-3 border border-error/30 bg-error/5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div>
            <p className="font-semibold text-error">Accès refusé</p>
            <p className="text-body-sm text-on-surface-variant">Votre rôle ne permet pas d'utiliser cette action.</p>
          </div>
        </div>
      )}
      {apiError === '502' && (
        <div className="bento-card flex items-start gap-3 border border-error/30 bg-error/5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div>
            <p className="font-semibold text-error">Service IA indisponible</p>
            <p className="text-body-sm text-on-surface-variant">Réessayez plus tard ou utilisez les brouillons existants.</p>
          </div>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {results.map((suggestion) => (
            <div className="bento-card space-y-3" key={suggestion.title}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-on-surface">{suggestion.title}</p>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{suggestion.short_description}</p>
                </div>
                <span className="rounded-full bg-primary-container/30 px-2 py-0.5 text-xs font-semibold text-primary">
                  BROUILLON
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
                <span>{suggestion.category}</span>
                <StatusBadge status={suggestion.activity_mode} />
                <span>{String(suggestion.age_min)}-{String(suggestion.age_max)} ans</span>
                {suggestion.is_free && <span className="font-semibold text-primary">Gratuit</span>}
                <span>{suggestion.estimated_duration}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleCreateDraft(suggestion)
                }}
              >
                Créer un brouillon
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="bento-card space-y-4">
        <div>
          <h2 className="text-label-lg font-bold text-on-surface">Historique</h2>
          <p className="text-body-sm text-on-surface-variant">
            {String(MOCK_RECOMMENDATION_REQUESTS.length)} demandes enregistrées
          </p>
        </div>
        <DataTable columns={columns} data={MOCK_RECOMMENDATION_REQUESTS} pageSize={10} />
      </div>
    </div>
  )
}
