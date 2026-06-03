import type { Registration } from '@/types/collections'

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg001', created: '2026-05-22T10:30:00.000Z', updated: '2026-05-22T10:30:00.000Z',
    user: 'user_y01', activity: 'act001', full_name: 'Amira Bouzid',
    phone: '0550123456', email: 'amira.bouzid@email.com',
    status: 'registered', qr_code: 'qr_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', checked_in_at: '',
    created_by: '', updated_by: '',
  },
  {
    id: 'reg002', created: '2026-05-22T11:00:00.000Z', updated: '2026-05-22T11:00:00.000Z',
    user: 'user_y02', activity: 'act001', full_name: 'Karim Meziane',
    phone: '0661234567', email: 'karim.meziane@email.com',
    status: 'registered', qr_code: 'qr_b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', checked_in_at: '',
    created_by: '', updated_by: '',
  },
  {
    id: 'reg003', created: '2026-05-23T09:15:00.000Z', updated: '2026-05-25T14:00:00.000Z',
    user: 'user_y03', activity: 'act001', full_name: 'Nadia Ouahab',
    phone: '0770987654', email: 'nadia.ouahab@email.com',
    status: 'waiting_list', qr_code: 'qr_c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', checked_in_at: '',
    created_by: '', updated_by: '',
  },
  {
    id: 'reg004', created: '2026-04-10T08:00:00.000Z', updated: '2026-05-05T10:00:00.000Z',
    user: 'user_y04', activity: 'act005', full_name: 'Youcef Hamdi',
    phone: '0555667788', email: 'youcef.hamdi@email.com',
    status: 'attended', qr_code: 'qr_d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', checked_in_at: '2026-05-05T09:02:00.000Z',
    created_by: '', updated_by: 'user005',
  },
  {
    id: 'reg005', created: '2026-05-01T16:00:00.000Z', updated: '2026-05-15T11:00:00.000Z',
    user: 'user_y05', activity: 'act003', full_name: 'Lydia Aït Amar',
    phone: '0661122334', email: 'lydia.aitamar@email.com',
    status: 'cancelled', qr_code: 'qr_e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', checked_in_at: '',
    created_by: '', updated_by: '',
  },
  {
    id: 'reg006', created: '2026-05-28T14:00:00.000Z', updated: '2026-05-28T14:00:00.000Z',
    user: 'user_y06', activity: 'act002', full_name: 'Ismail Cherif',
    phone: '0770112233', email: 'ismail.cherif@email.com',
    status: 'registered', qr_code: 'qr_f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1', checked_in_at: '',
    created_by: '', updated_by: '',
  },
]
