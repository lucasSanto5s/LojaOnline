// src/store/slices/ordersSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getJSON, setJSON } from '@/utils/storage'

export type OrderItem = {
  id: number
  title: string
  price: number
  qty: number
  image?: string
}

export type Order = {
  id: string
  userId: string
  createdAt: string
  total: number
  items: OrderItem[]
}

type OrdersState = {
  items: Order[]
}

const ORDERS_KEY = 'orders'

const initialState: OrdersState = {
  items: getJSON<Order[]>(ORDERSKEY, []),
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Omit<Order, 'id'>>) {
      const newOrder: Order = {
        ...action.payload,
        id: `o${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      }
      state.items.push(newOrder)
      setJSON(ORDERS_KEY, state.items)
    },

    // opcional, se algum dia quiser limpar tudo
    clearAllOrders(state) {
      state.items = []
      setJSON(ORDERS_KEY, state.items)
    },
  },
})

export const { addOrder, clearAllOrders } = ordersSlice.actions
export default ordersSlice.reducer