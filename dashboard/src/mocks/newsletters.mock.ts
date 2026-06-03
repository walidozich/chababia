import type { Newsletter } from '@/types/collections'

export const MOCK_NEWSLETTERS: Newsletter[] = [
  {
    id: 'nl001', created: '2026-05-01T09:00:00.000Z', updated: '2026-05-01T09:00:00.000Z',
    title: 'Bulletin Jeunesse Béjaïa — Juin 2026', content: 'Découvrez les activités du mois de juin dans votre wilaya : ateliers robotique, tournois sportifs et camps d\'été. Retrouvez le programme complet sur Chababia.',
    language: 'fr', target_commune: '', target_wilaya: 'Béjaïa', related_activity: 'act001',
    related_establishment: 'est001', thumbnail: '', status: 'published',
    published_at: '2026-05-01T09:00:00.000Z', last_verified_at: '2026-05-01T09:00:00.000Z',
    created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'nl002', created: '2026-04-28T10:00:00.000Z', updated: '2026-05-05T14:00:00.000Z',
    title: 'نشرة الشباب الجزائري — ماي 2026', content: 'اكتشف الأنشطة الشبابية لشهر ماي في ولايتك: دورات رياضية، فعاليات ثقافية، ومخيمات صيفية. سجّل الآن على منصة شبابية.',
    language: 'ar', target_commune: '', target_wilaya: 'Alger', related_activity: '',
    related_establishment: 'est002', thumbnail: '', status: 'published',
    published_at: '2026-05-01T09:00:00.000Z', last_verified_at: '2026-05-05T14:00:00.000Z',
    created_by: 'user001', updated_by: 'user001',
  },
  {
    id: 'nl003', created: '2026-05-20T08:00:00.000Z', updated: '2026-05-20T08:00:00.000Z',
    title: 'Bulletin Jeunesse Oran — Juillet 2026', content: 'Édition spéciale été : festival des arts, formation web et programme Erasmus+. Inscriptions ouvertes jusqu\'au 15 juin.',
    language: 'fr', target_commune: 'Oran', target_wilaya: 'Oran', related_activity: 'act004',
    related_establishment: 'est003', thumbnail: '', status: 'draft',
    published_at: '', last_verified_at: '',
    created_by: 'user003', updated_by: 'user003',
  },
]
