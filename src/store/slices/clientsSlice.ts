import { createSlice } from '@reduxjs/toolkit'
type Client = { id: string; name: string; email: string; phone?: string; address?: string; status?: 'activated'|'deactivated'; createdAt?: string }
type ClientsState = { list: Client[] }
const initialState: ClientsState = { list: [] }

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients(state, action) { state.list = action.payload },
  },
})
export const { setClients } = clientsSlice.actions
export default clientsSlice.reducer
