import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Archive, Check, ClipboardCheck, HelpCircle, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'
import type { ProjectStatus, ProjectSubmission } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, getOne, qk, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card space-y-4">
      <h2 className="text-label-lg font-bold text-on-surface">{title}</h2>
      <Separator />
      {children}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/70">{label}</p>
      <div className="mt-1 text-body-sm text-on-surface">{value || '—'}</div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'project_submissions', role, isAdmin)
  const queryClient = useQueryClient()
  const [mentor, setMentor] = useState('')

  const projectQuery = useQuery({
    queryKey: qk.detail(COLLECTIONS.projectSubmissions, id),
    queryFn: () => getOne<ProjectSubmission>(COLLECTIONS.projectSubmissions, id ?? '', {
      expand: 'user,establishment',
    }),
    enabled: Boolean(id),
    staleTime: STALE.projectSubmissions,
  })

  const submission = projectQuery.data

  useEffect(() => {
    if (submission) {
      setMentor(submission.assigned_mentor)
    }
  }, [submission])

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Pick<ProjectSubmission, 'assigned_mentor' | 'status'>>) => updateRecord<ProjectSubmission>(
      COLLECTIONS.projectSubmissions,
      id ?? '',
      payload,
    ),
    onSuccess: (updatedSubmission) => {
      toast.success('Projet mis à jour', { description: updatedSubmission.project_title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.projectSubmissions) })
    },
  })

  if (projectQuery.isLoading) {
    return <PageSkeleton />
  }

  if (!submission) {
    return (
      <div className="bento-card py-16 text-center">
        <p className="text-label-lg font-bold text-on-surface">Projet introuvable.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/projects">Retour</Link>
        </Button>
      </div>
    )
  }

  const currentSubmission = submission
  const user = currentSubmission.expand?.user
  const establishment = currentSubmission.expand?.establishment

  function handleStatusChange(status: ProjectStatus | 'archived') {
    if (status === 'archived') {
      toast.error('Archivage non disponible', { description: 'Le schéma projet ne définit pas de statut archivé.' })
      return
    }

    updateMutation.mutate({ status })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentSubmission.project_title}
        description="Dossier de soumission jeunesse"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Résumé">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow label="Catégorie" value={<StatusBadge status={currentSubmission.category} />} />
              <DetailRow label="Commune" value={currentSubmission.commune} />
              <DetailRow label="Porteur" value={user?.full_name ?? 'Inconnu'} />
              <DetailRow label="Téléphone" value={currentSubmission.contact_phone} />
            </div>
            <DetailRow label="Description courte" value={currentSubmission.short_description} />
            <DetailRow label="Soutien demandé" value={currentSubmission.needed_support} />
          </SectionCard>

          <SectionCard title="Contexte">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow label="Établissement associé" value={establishment?.name ?? '—'} />
              <DetailRow label="Document" value={currentSubmission.optional_document || '—'} />
              <DetailRow label="Créé le" value={new Date(currentSubmission.created).toLocaleDateString('fr-FR')} />
              <DetailRow label="Modifié le" value={new Date(currentSubmission.updated).toLocaleDateString('fr-FR')} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Décision">
            <div className="flex items-center justify-between gap-3">
              <span className="text-body-sm text-on-surface-variant">Statut actuel</span>
              <StatusBadge status={currentSubmission.status} />
            </div>

            <div className="space-y-2">
              {currentSubmission.status === 'submitted' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('reviewed')
                    }}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Marquer examiné
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('accepted')
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('rejected')
                    }}
                  >
                    <X className="h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('needs_more_info')
                    }}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Infos manquantes
                  </Button>
                </>
              )}
              {currentSubmission.status === 'reviewed' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('accepted')
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('rejected')
                    }}
                  >
                    <X className="h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!canWrite || updateMutation.isPending}
                    onClick={() => {
                      handleStatusChange('needs_more_info')
                    }}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Infos manquantes
                  </Button>
                </>
              )}
              {(currentSubmission.status === 'accepted' || currentSubmission.status === 'rejected') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled={!canWrite || updateMutation.isPending}
                  onClick={() => {
                    handleStatusChange('archived')
                  }}
                >
                  <Archive className="h-4 w-4" />
                  Archiver
                </Button>
              )}
              {currentSubmission.status === 'needs_more_info' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled={!canWrite || updateMutation.isPending}
                  onClick={() => {
                    handleStatusChange('reviewed')
                  }}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Marquer examiné
                </Button>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-label-sm font-semibold text-on-surface" htmlFor="assigned-mentor">
                Mentor assigné
              </label>
              <Input
                id="assigned-mentor"
                value={mentor}
                onChange={(event) => {
                  setMentor(event.target.value)
                }}
                onBlur={() => {
                  if (mentor !== currentSubmission.assigned_mentor) {
                    updateMutation.mutate({ assigned_mentor: mentor })
                  }
                }}
                placeholder="Nom du mentor"
                disabled={!canWrite || updateMutation.isPending}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
