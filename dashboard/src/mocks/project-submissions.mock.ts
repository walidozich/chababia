import type { ProjectSubmission } from '@/types/collections'

export const MOCK_PROJECT_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: 'ps001', created: '2026-05-20T10:00:00.000Z', updated: '2026-05-25T14:00:00.000Z',
    user: 'user_y01', establishment: 'est001', project_title: 'Application mobile de covoiturage solidaire',
    category: 'Coding', commune: 'Béjaïa',
    short_description: 'Une app mobile de mise en relation entre jeunes conducteurs et passagers dans les zones rurales mal desservies par les transports.',
    needed_support: 'Mentorat technique, hébergement serveur, accès à un espace de travail',
    contact_phone: '0550123456', optional_document: 'covoiturage-projet.pdf',
    status: 'submitted', assigned_mentor: '', created_by: '', updated_by: '',
  },
  {
    id: 'ps002', created: '2026-05-10T09:00:00.000Z', updated: '2026-05-28T11:00:00.000Z',
    user: 'user_y07', establishment: 'est003', project_title: 'Jardin communautaire urbain — Oran',
    category: 'Environment', commune: 'Oran',
    short_description: 'Transformer un terrain vague de 500m² en jardin communautaire pour les familles du quartier avec des méthodes d\'agriculture biologique.',
    needed_support: 'Semences, outils agricoles, formation permaculture',
    contact_phone: '0661987654', optional_document: '',
    status: 'reviewed', assigned_mentor: 'Prof. Salim Boudiaf', created_by: '', updated_by: 'user001',
  },
  {
    id: 'ps003', created: '2026-04-15T08:00:00.000Z', updated: '2026-05-20T16:00:00.000Z',
    user: 'user_y08', establishment: '', project_title: 'Club de robotique scolaire — Constantine',
    category: 'Robotics', commune: 'Constantine',
    short_description: 'Créer un club de robotique parascolaire gratuit pour les collégiens de 12 à 15 ans, avec des compétitions régionales.',
    needed_support: 'Kits Arduino, salle dédiée, formateur bénévole',
    contact_phone: '0770445566', optional_document: 'robotique-club-plan.pdf',
    status: 'accepted', assigned_mentor: 'Ing. Rania Khelif', created_by: '', updated_by: 'user001',
  },
  {
    id: 'ps004', created: '2026-05-28T15:00:00.000Z', updated: '2026-05-28T15:00:00.000Z',
    user: 'user_y09', establishment: 'est002', project_title: 'Podcast « Jeunesse Algérienne »',
    category: 'Culture', commune: 'Hussein Dey',
    short_description: 'Série de podcasts donnant la parole aux jeunes algériens sur leurs réalités, projets et rêves. Diffusion sur les plateformes streaming.',
    needed_support: 'Micro, logiciel d\'édition audio, accompagnement médias',
    contact_phone: '0550334455', optional_document: '',
    status: 'needs_more_info', assigned_mentor: '', created_by: '', updated_by: 'user001',
  },
]
