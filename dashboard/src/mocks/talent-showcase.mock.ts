import type { TalentShowcase } from '@/types/collections'

export const MOCK_TALENT_SHOWCASE: TalentShowcase[] = [
  {
    id: 'ts001', created: '2026-05-01T10:00:00.000Z', updated: '2026-05-10T12:00:00.000Z',
    user: 'user_y10', title: 'Série photo « Visages du Sahara »',
    description: '40 portraits en noir et blanc capturant la vie quotidienne des communautés nomades du Tamanrasset.',
    category: 'Photography', media: 'visages-sahara-cover.jpg', external_link: 'https://instagram.com/nomad_lens_dz',
    status: 'published', published_at: '2026-05-10T12:00:00.000Z', last_verified_at: '2026-05-10T12:00:00.000Z',
    created_by: '', updated_by: 'user004',
  },
  {
    id: 'ts002', created: '2026-05-15T09:00:00.000Z', updated: '2026-05-15T09:00:00.000Z',
    user: 'user_y11', title: 'Application « DarijaLearn » — Apprendre le dialecte algérien',
    description: 'Application mobile gamifiée pour apprendre le dialecte algérien (darija) à travers des exercices quotidiens et des histoires culturelles.',
    category: 'Coding', media: 'darija-learn-screen.png', external_link: 'https://play.google.com/store/apps/darija-learn',
    status: 'published', published_at: '2026-05-15T09:00:00.000Z', last_verified_at: '2026-05-15T09:00:00.000Z',
    created_by: '', updated_by: 'user004',
  },
  {
    id: 'ts003', created: '2026-05-28T11:00:00.000Z', updated: '2026-05-28T11:00:00.000Z',
    user: 'user_y12', title: 'Peinture murale « Racines »',
    description: 'Fresque de 12 mètres réalisée sur un mur de Tizi Ouzou représentant la fusion des cultures berbère, arabe et méditerranéenne.',
    category: 'Arts', media: '', external_link: '',
    status: 'draft', published_at: '', last_verified_at: '',
    created_by: '', updated_by: '',
  },
]
