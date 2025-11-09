import { createSlice } from '@reduxjs/toolkit'
type User = { id: string; name: string; email: string; password?: string; role: 'admin'|'user'; avatar?: string }
type UsersState = { list: User[] }
const initialState: UsersState = { list: [] }

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) { state.list = action.payload },
  },
})
export const { setUsers } = usersSlice.actions
export default usersSlice.reducer
