import type { ContentReport } from '@/types/collections'

export const MOCK_CONTENT_REPORTS: ContentReport[] = [
  {
    id: 'cr001', created: '2026-05-25T14:00:00.000Z', updated: '2026-05-25T14:00:00.000Z',
    reporter: 'user_y03', target_type: 'activity', target_id: 'act006',
    reason: 'outdated_info', details: 'L\'activité affiche encore le statut "publié" alors qu\'elle a été annulée il y a deux semaines.',
    status: 'new', created_by: '', updated_by: '',
  },
  {
    id: 'cr002', created: '2026-05-22T10:00:00.000Z', updated: '2026-05-27T16:00:00.000Z',
    reporter: 'user_y05', target_type: 'establishment', target_id: 'est004',
    reason: 'wrong_contact', details: 'Le numéro de téléphone affiché (026 22 14 56) est hors service depuis le mois dernier.',
    status: 'reviewed', created_by: '', updated_by: 'user001',
  },
  {
    id: 'cr003', created: '2026-05-28T09:00:00.000Z', updated: '2026-05-28T09:00:00.000Z',
    reporter: 'user_y08', target_type: 'announcement', target_id: 'ann001',
    reason: 'outdated_info', details: 'La date dans l\'annonce est déjà passée, mais elle est toujours en statut publié.',
    status: 'new', created_by: '', updated_by: '',
  },
  {
    id: 'cr004', created: '2026-05-10T11:00:00.000Z', updated: '2026-05-20T10:00:00.000Z',
    reporter: 'user_y02', target_type: 'activity', target_id: 'act002',
    reason: 'wrong_location', details: 'L\'adresse indiquée dans l\'activité ne correspond pas au lieu réel du tournoi.',
    status: 'resolved', created_by: '', updated_by: 'user001',
  },
]
