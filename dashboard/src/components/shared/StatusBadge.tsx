import { cn } from '@/lib/utils'
import type {
  ActivityStatus,
  ContentStatus,
  RegistrationStatus,
  ProjectStatus,
  TalentStatus,
  ReportStatus,
  EstablishmentStatus,
  AnnouncementPriority,
  RecommendationStatus,
} from '@/types/collections'

type AnyStatus =
  | ActivityStatus
  | ContentStatus
  | RegistrationStatus
  | ProjectStatus
  | TalentStatus
  | ReportStatus
  | EstablishmentStatus
  | AnnouncementPriority
  | RecommendationStatus

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Activity / Content / Establishment
  draft: { label: 'Brouillon', className: 'bg-surface-container text-on-surface-variant border-outline' },
  published: { label: 'Publié', className: 'bg-primary/15 text-on-surface border-primary/30' },
  archived: { label: 'Archivé', className: 'bg-surface-container text-on-surface-variant/60 border-outline' },
  cancelled: { label: 'Annulé', className: 'bg-error/10 text-error border-error/20' },
  // Registration
  registered: { label: 'Inscrit', className: 'bg-primary/15 text-on-surface border-primary/30' },
  waiting_list: { label: 'Liste att.', className: 'bg-secondary/15 text-secondary border-secondary/30' },
  attended: { label: 'Présent', className: 'bg-tertiary/15 text-tertiary border-tertiary/30' },
  // Project
  submitted: { label: 'Soumis', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: { label: 'Examiné', className: 'bg-secondary/15 text-secondary border-secondary/30' },
  accepted: { label: 'Accepté', className: 'bg-primary/15 text-on-surface border-primary/30' },
  rejected: { label: 'Rejeté', className: 'bg-error/10 text-error border-error/20' },
  needs_more_info: { label: 'Info manq.', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  // Report
  new: { label: 'Nouveau', className: 'bg-error/10 text-error border-error/20' },
  resolved: { label: 'Résolu', className: 'bg-primary/15 text-on-surface border-primary/30' },
  dismissed: { label: 'Ignoré', className: 'bg-surface-container text-on-surface-variant/60 border-outline' },
  // Priority
  normal: { label: 'Normal', className: 'bg-surface-container text-on-surface-variant border-outline' },
  high: { label: 'Haute', className: 'bg-secondary/15 text-secondary border-secondary/30' },
  urgent: { label: 'Urgent', className: 'bg-error/10 text-error border-error/20' },
  // Recommendation
  pending: { label: 'En attente', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  completed: { label: 'Complété', className: 'bg-primary/15 text-on-surface border-primary/30' },
  cached: { label: 'Cache', className: 'bg-surface-container text-on-surface-variant border-outline' },
  failed: { label: 'Échoué', className: 'bg-error/10 text-error border-error/20' },
}

interface StatusBadgeProps {
  status: AnyStatus | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-surface-container text-on-surface-variant border-outline' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
