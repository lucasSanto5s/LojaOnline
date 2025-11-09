import { createSlice } from '@reduxjs/toolkit'

type UIState = { theme: 'light' | 'dark' }
const initialState: UIState = (() => {
  const saved = localStorage.getItem('ui_theme')
  return { theme: (saved === 'dark' ? 'dark' : 'light') }
})()

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('ui_theme', state.theme)
    },
  },
})
export const { toggleTheme } = uiSlice.actions
export default uiSlice.reducer
