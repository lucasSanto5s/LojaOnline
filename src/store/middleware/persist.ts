import type { Middleware } from '@reduxjs/toolkit'

const PERSIST_KEY = 'app_state_v1'

const persist: Middleware = store => next => action => {
  const result = next(action)
  const state = store.getState()
  // escolha o que persistir
  const toSave = {
    ui: state.ui,
    auth: state.auth,
    users: state.users,
    products: state.products,
    clients: state.clients,
    cart: state.cart,
  }
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(toSave)) } catch {}
  return result
}

export const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch { return undefined }
}

export default persist
