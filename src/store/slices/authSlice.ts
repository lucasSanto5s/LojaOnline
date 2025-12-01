// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getJSON, setJSON } from '@/utils/storage'

export type Role = 'admin' | 'user'

export type AppUser = {
  id: string        // u1, u2, ou u_timestamp
  name: string
  email: string
  password?: string // opcional (para não quebrar usuários seed antigos)
  role: Role
  avatar?: string
  createdAt?: string
}

type AuthState = {
  currentUser: AppUser | null
  users: AppUser[]
}

const USERS_KEY = 'users'
const CURRENT_KEY = 'currentUser'

// === Carrega os usuários (já seedados pelo utils/seed.ts) ===
const initialUsers = getJSON<AppUser[]>(USERS_KEY, [])

// === Carrega usuário logado, se existir ===
const initialCurrentUser = getJSON<AppUser | null>(CURRENT_KEY, null)

const initialState: AuthState = {
  currentUser: initialCurrentUser,
  users: initialUsers,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // =========================================
    // LOGIN
    // =========================================
    loginSuccess(state, action: PayloadAction<AppUser>) {
      state.currentUser = action.payload
      setJSON(CURRENT_KEY, action.payload)
    },

    // =========================================
    // LOGOUT
    // =========================================
    logout(state) {
      state.currentUser = null
      setJSON(CURRENT_KEY, null)
    },

    // =========================================
    // CRUD DE USUÁRIOS (GERENCIAMENTO DE USUÁRIOS)
    // =========================================

    // CREATE
    addUser(
      state,
      action: PayloadAction<Omit<AppUser, 'id' | 'createdAt'>>
    ) {
      const newUser: AppUser = {
        ...action.payload,
        id: `u_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      state.users.push(newUser)
      setJSON(USERS_KEY, state.users)
    },

    // UPDATE
    updateUser(state, action: PayloadAction<AppUser>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id)
      if (idx === -1) return

      state.users[idx] = action.payload
      setJSON(USERS_KEY, state.users)

      // se estiver editando o próprio usuário → sincroniza currentUser
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload
        setJSON(CURRENT_KEY, action.payload)
      }
    },

    // DELETE
    deleteUser(state, action: PayloadAction<string>) {
      const id = action.payload

      state.users = state.users.filter((u) => u.id !== id)
      setJSON(USERS_KEY, state.users)

      // se apagar o usuário logado → logout
      if (state.currentUser?.id === id) {
        state.currentUser = null
        setJSON(CURRENT_KEY, null)
      }
    },
  },
})

export const {
  loginSuccess,
  logout,
  addUser,
  updateUser,
  deleteUser,
} = slice.actions

export default slice.reducer