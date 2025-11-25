// src/store/slices/clientsSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ClientStatus = 'activated' | 'deactivated'

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: string // ISO
  address: string
  phone: string
  status: ClientStatus
}

interface ClientsState {
  items: Client[]
  loaded: boolean
}

const STORAGE_KEY = 'online-shop/clients'

function loadFromStorage(): Client[] | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    return JSON.parse(raw) as Client[]
  } catch {
    return undefined
  }
}

function saveToStorage(items: Client[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors (modo privado etc)
  }
}

const initialItems = loadFromStorage() ?? []

const initialState: ClientsState = {
  items: initialItems,
  loaded: false,
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients(state, action: PayloadAction<Client[]>) {
      state.items = action.payload
      state.loaded = true
      saveToStorage(state.items)
    },
    createClient(
      state,
      action: PayloadAction<Omit<Client, 'id'>>
    ) {
      const nextId =
        state.items.length > 0
          ? Math.max(...state.items.map((c) => c.id)) + 1
          : 1

      state.items.push({ ...action.payload, id: nextId })
      saveToStorage(state.items)
    },
    updateClient(state, action: PayloadAction<Client>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id)
      if (idx >= 0) {
        state.items[idx] = action.payload
        saveToStorage(state.items)
      }
    },
    deleteClient(state, action: PayloadAction<number>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
      saveToStorage(state.items)
    },
  },
})

export const {
  setClients,
  createClient,
  updateClient,
  deleteClient,
} = clientsSlice.actions

export default clientsSlice.reducer