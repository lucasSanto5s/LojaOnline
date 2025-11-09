import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook} from 'react-redux'
import persist from './middleware/persist'
import ui from './slices/uiSlice'
import auth from './slices/authSlice'
import users from './slices/usersSlice'
import products from './slices/productsSlice'
import clients from './slices/clientsSlice'
import cart from './slices/cartSlice'
import { ensureSeed } from '@/utils/seed'

const store = configureStore({
  reducer: { ui, auth, users, products, clients, cart },
  middleware: getDefault => getDefault().concat(persist),
})

// cria usuários seed no primeiro load
ensureSeed(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
