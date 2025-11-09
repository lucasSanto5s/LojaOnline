import { createSlice } from '@reduxjs/toolkit'
type CartItem = { productId: string; qty: number }
type CartState = { items: CartItem[] }
const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) { state.items = action.payload },
  },
})
export const { setCart } = cartSlice.actions
export default cartSlice.reducer
