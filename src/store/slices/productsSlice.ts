import { createSlice } from '@reduxjs/toolkit'
type Product = { id: string; title: string; price: number; description?: string; category?: string; image?: string }
type ProductsState = { list: Product[] }
const initialState: ProductsState = { list: [] }

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) { state.list = action.payload },
  },
})
export const { setProducts } = productsSlice.actions
export default productsSlice.reducer
