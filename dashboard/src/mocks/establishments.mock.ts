import type { Establishment } from '@/types/collections'

export const MOCK_ESTABLISHMENTS: Establishment[] = [
  {
    id: 'est001', created: '2026-01-15T08:00:00.000Z', updated: '2026-05-20T10:00:00.000Z',
    name: 'Maison de Jeunes de Béjaïa Centre', type: 'youth_house',
    commune: 'Béjaïa', wilaya: 'Béjaïa', address: 'Rue des Frères Bouaziz, Béjaïa 06000',
    latitude: 36.7509, longitude: 5.0564, phone: '034 21 45 67', email: 'mj.bejaia@odej.dz',
    opening_hours: 'Dim–Jeu 08h–17h', services: 'Informatique, salle polyvalente, bibliothèque',
    accessibility_notes: 'Accès PMR disponible', image: '', status: 'published',
    last_verified_at: '2026-05-20T10:00:00.000Z', created_by: 'user001', updated_by: 'user002',
  },
  {
    id: 'est002', created: '2026-01-15T08:00:00.000Z', updated: '2026-04-10T14:00:00.000Z',
    name: 'Complexe Sportif Moussa Haddad — Alger', type: 'sports_complex',
    commune: 'Hussein Dey', wilaya: 'Alger', address: '12 Cité Climat de France, Hussein Dey 16007',
    latitude: 36.7370, longitude: 3.1016, phone: '021 77 88 99', email: 'cs.hussein@odej.dz',
    opening_hours: 'Sam–Jeu 07h–20h', services: 'Terrain football, salle de gym, piscine couverte',
    accessibility_notes: '', image: '', status: 'published',
    last_verified_at: '2026-04-10T14:00:00.000Z', created_by: 'user001', updated_by: 'user001',
  },
  {
    id: 'est003', created: '2026-02-01T08:00:00.000Z', updated: '2026-02-01T08:00:00.000Z',
    name: 'Maison de Jeunes Larbi Ben M\'hidi — Oran', type: 'youth_house',
    commune: 'Oran', wilaya: 'Oran', address: 'Avenue Larbi Ben M\'hidi, Oran 31000',
    latitude: 35.6971, longitude: -0.6308, phone: '041 33 22 11', email: 'mj.oran@odej.dz',
    opening_hours: 'Dim–Jeu 08h–16h30', services: 'Atelier arts plastiques, théâtre, musique',
    accessibility_notes: 'Rampe d\'accès en travaux', image: '', status: 'published',
    last_verified_at: '2026-02-01T08:00:00.000Z', created_by: 'user003', updated_by: 'user003',
  },
  {
    id: 'est004', created: '2026-03-01T08:00:00.000Z', updated: '2026-03-01T08:00:00.000Z',
    name: 'Auberge de Jeunesse de Tizi Ouzou', type: 'youth_hostel',
    commune: 'Tizi Ouzou', wilaya: 'Tizi Ouzou', address: 'Route Nationale 12, Tizi Ouzou 15000',
    latitude: 36.7167, longitude: 4.0500, phone: '026 22 14 56', email: 'aj.tizi@odej.dz',
    opening_hours: '24h/24', services: 'Hébergement 80 lits, salle commune, Wi-Fi',
    accessibility_notes: '', image: '', status: 'draft',
    last_verified_at: '', created_by: 'user001', updated_by: 'user001',
  },
]
