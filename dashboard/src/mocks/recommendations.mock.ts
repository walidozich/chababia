import type { RecommendationRequest, Suggestion } from '@/types/collections'

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    title: 'Atelier Sécurité Numérique', short_description: 'Sensibilisation aux risques d\'Internet, protection des données et bonnes pratiques numériques pour les jeunes.',
    category: 'Coding', activity_mode: 'physical', age_min: 14, age_max: 30, is_free: true, estimated_duration: '3h',
  },
  {
    title: 'Tournoi d\'Échecs Intercommunal', short_description: 'Compétition d\'échecs réunissant les jeunes de plusieurs communes pour promouvoir la réflexion stratégique.',
    category: 'Culture', activity_mode: 'physical', age_min: 12, age_max: 25, is_free: true, estimated_duration: '1 journée',
  },
  {
    title: 'Initiation à l\'Apiculture Urbaine', short_description: 'Découverte de l\'élevage d\'abeilles en milieu urbain et de son rôle dans la biodiversité locale.',
    category: 'Environment', activity_mode: 'physical', age_min: 16, age_max: 35, is_free: true, estimated_duration: '2 jours',
  },
]

export const MOCK_RECOMMENDATION_REQUESTS: RecommendationRequest[] = [
  {
    id: 'rr001', created: '2026-05-20T11:00:00.000Z', updated: '2026-05-20T11:05:00.000Z',
    commune: 'Béjaïa', wilaya: 'Béjaïa', establishment_type: 'youth_house',
    input_summary: 'commune=Béjaïa wilaya=Béjaïa type=youth_house season=summer',
    model_provider: 'anthropic', model_api_used: 'claude-3-5-sonnet-20241022',
    suggestions_json: JSON.stringify(MOCK_SUGGESTIONS),
    status: 'completed', admin_user: 'user001', created_by: 'user001', updated_by: 'user001',
  },
  {
    id: 'rr002', created: '2026-05-15T14:00:00.000Z', updated: '2026-05-15T14:00:00.000Z',
    commune: 'Oran', wilaya: 'Oran', establishment_type: 'sports_complex',
    input_summary: 'commune=Oran wilaya=Oran type=sports_complex',
    model_provider: 'anthropic', model_api_used: 'claude-3-5-sonnet-20241022',
    suggestions_json: '[]',
    status: 'cached', admin_user: 'user003', created_by: 'user003', updated_by: 'user003',
  },
]
