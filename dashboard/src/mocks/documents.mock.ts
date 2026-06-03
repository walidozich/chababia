import type { Document } from '@/types/collections'

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc001', created: '2026-02-01T09:00:00.000Z', updated: '2026-02-01T09:00:00.000Z',
    title: 'Guide d\'orientation ODEJ 2026', description: 'Guide complet des structures, services et opportunités offerts par l\'ODEJ aux jeunes algériens.',
    file: 'guide-orientation-odej-2026.pdf', language: 'fr', category: 'orientation', establishment: '',
    status: 'published', last_verified_at: '2026-02-01T09:00:00.000Z', created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'doc002', created: '2026-03-15T10:00:00.000Z', updated: '2026-04-01T08:00:00.000Z',
    title: 'Formulaire de demande de bourse sportive', description: 'Formulaire officiel pour la demande d\'aide financière aux jeunes sportifs de haut niveau.',
    file: 'formulaire-bourse-sportive-2026.pdf', language: 'fr', category: 'legal', establishment: '',
    status: 'published', last_verified_at: '2026-04-01T08:00:00.000Z', created_by: 'user001', updated_by: 'user001',
  },
  {
    id: 'doc003', created: '2026-01-20T09:00:00.000Z', updated: '2026-01-20T09:00:00.000Z',
    title: 'دليل الشباب الجزائري 2026', description: 'دليل شامل بالفرص والخدمات المتاحة للشباب في إطار برامج الديوان الوطني للشباب.',
    file: 'dalil-chabab-2026.pdf', language: 'ar', category: 'orientation', establishment: '',
    status: 'published', last_verified_at: '2026-01-20T09:00:00.000Z', created_by: 'user004', updated_by: 'user004',
  },
  {
    id: 'doc004', created: '2026-05-10T11:00:00.000Z', updated: '2026-05-10T11:00:00.000Z',
    title: 'Programme de formation professionnelle été 2026', description: 'Catalogue des formations professionnelles courtes proposées dans les maisons de jeunes cet été.',
    file: 'catalogue-formations-ete-2026.pdf', language: 'fr', category: 'training', establishment: 'est001',
    status: 'draft', last_verified_at: '', created_by: 'user002', updated_by: 'user002',
  },
]
