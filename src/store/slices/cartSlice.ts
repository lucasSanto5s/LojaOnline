import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'

export type CartItem = {
  id: number
  title: string
  price: number
  image: string
  qty: number
}

type CartState = {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const i = state.items.findIndex(it => it.id === action.payload.id)
      if (i >= 0) state.items[i].qty += action.payload.qty || 1
      else state.items.push({ ...action.payload, qty: action.payload.qty || 1 })
    },
    increment: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.qty += 1
    },
    decrement: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (!item) return
      item.qty -= 1
      if (item.qty <= 0) {
        state.items = state.items.filter(i => i.id !== action.payload)
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clear: (state) => { state.items = [] },
  },
})

export const { addItem, increment, decrement, remove, clear } = slice.actions
export default slice.reducer

// selectors
export const selectCart = (s: RootState) => s.cart.items
export const selectCartTotal = (s: RootState) =>
  s.cart.items.reduce((sum, it) => sum + it.price * it.qty, 0)
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((sum, it) => sum + it.qty, 0)
