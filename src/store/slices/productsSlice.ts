import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const CATEGORIES = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
] as const

export type Category = typeof CATEGORIES[number]

export type Product = {
  id: number
  title: string
  price: number
  description: string
  category?: Category | string
  image: string
  rating?: { rate: number; count: number }
}

type ProductsState = {
  items: Product[]
  loaded: boolean
  query: string          // 🔎 filtro global
}

const LS_KEY = 'products'

function load(): Product[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function save(items: Product[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch {}
}

const initialState: ProductsState = {
  items: load(),
  loaded: false,
  query: '',
}

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAll(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
      state.loaded = true
      save(state.items)
    },
    setQuery(state, action: PayloadAction<string>) {   // 🔎
      state.query = action.payload
    },
    addProduct(state, action: PayloadAction<Omit<Product, 'id'>>) {
      const nextId = (state.items.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1
      state.items.push({ id: nextId, ...action.payload })
      save(state.items)
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const i = state.items.findIndex(p => p.id === action.payload.id)
      if (i >= 0) state.items[i] = action.payload
      save(state.items)
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter(p => p.id !== action.payload)
      save(state.items)
    },
  },
})

export const { setAll, setQuery, addProduct, updateProduct, removeProduct } = slice.actions
export default slice.reducer
