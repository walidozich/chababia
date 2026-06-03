import type { Announcement } from '@/types/collections'

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann001', created: '2026-05-28T09:00:00.000Z', updated: '2026-05-28T09:00:00.000Z',
    title: 'Fermeture exceptionnelle — Fête nationale', content: 'Toutes les maisons de jeunes seront fermées le 5 juillet 2026 à l\'occasion de la fête nationale de l\'indépendance. Les activités prévues ce jour sont reportées.',
    priority: 'high', related_establishment: '', related_activity: '', language: 'fr', status: 'published',
    last_verified_at: '2026-05-28T09:00:00.000Z', created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'ann002', created: '2026-05-25T10:00:00.000Z', updated: '2026-05-25T10:00:00.000Z',
    title: 'Appel à candidatures — Programme d\'échange', content: 'L\'ODEJ lance un appel à candidatures pour un programme d\'échange international avec 5 pays arabes. 20 places disponibles pour les jeunes de 18 à 28 ans.',
    priority: 'normal', related_establishment: '', related_activity: '', language: 'fr', status: 'published',
    last_verified_at: '2026-05-25T10:00:00.000Z', created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'ann003', created: '2026-05-20T08:00:00.000Z', updated: '2026-05-20T08:00:00.000Z',
    title: 'Alerte : Canicule — Modification des horaires', content: 'En raison des fortes chaleurs prévues la semaine prochaine, les activités sportives en plein air sont suspendues entre 11h et 16h sur l\'ensemble du territoire national.',
    priority: 'urgent', related_establishment: '', related_activity: 'act002', language: 'all', status: 'published',
    last_verified_at: '2026-05-20T08:00:00.000Z', created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'ann004', created: '2026-05-15T11:00:00.000Z', updated: '2026-05-18T14:00:00.000Z',
    title: 'Nouveau partenariat ODEJ–Ministère du Numérique', content: 'L\'ODEJ et le Ministère de la Transition Numérique ont signé un mémorandum de coopération pour équiper 50 maisons de jeunes en infrastructure numérique d\'ici fin 2026.',
    priority: 'normal', related_establishment: '', related_activity: '', language: 'fr', status: 'archived',
    last_verified_at: '2026-05-15T11:00:00.000Z', created_by: 'user004', updated_by: 'user001',
  },
  {
    id: 'ann005', created: '2026-06-01T08:00:00.000Z', updated: '2026-06-01T08:00:00.000Z',
    title: 'إعلان عن مسابقة الشعر والأدب الشبابي', content: 'تُنظّم المديرية الولائية للشباب مسابقة وطنية في الشعر والأدب للشباب دون الثلاثين عامًا. آخر أجل للتسجيل هو 30 يونيو 2026.',
    priority: 'normal', related_establishment: '', related_activity: '', language: 'ar', status: 'draft',
    last_verified_at: '', created_by: 'user004', updated_by: 'user004',
  },
]
