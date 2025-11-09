import type { Store } from '@reduxjs/toolkit'
import { getJSON, setJSON } from './storage'

const USERS_KEY = 'seed_users_v1'

export function ensureSeed(store: Store) {
  const ok = getJSON<boolean>(USERS_KEY, false)
  if (ok) return
  const users = [
    { id: 'u1', name: 'ADMIN', email: 'admin@admin.com', password: 'admin123', role: 'admin' },
    { id: 'u2', name: 'JOHN',  email: 'user@demo.com',  password: 'user123',  role: 'user'  },
  ]
  setJSON('users', users)
  setJSON(USERS_KEY, true)
}
