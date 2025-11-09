import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type Role = 'admin'|'user'
export type AppUser = { id: string; name: string; email: string; role: Role; avatar?: string }

type AuthState = { currentUser: AppUser | null }
const initialState: AuthState = { currentUser: null }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AppUser>) { state.currentUser = action.payload },
    logout(state) { state.currentUser = null },
  },
})
export const { loginSuccess, logout } = slice.actions
export default slice.reducer
