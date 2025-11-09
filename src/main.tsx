import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { useAppSelector } from '@/store'
import App from './App'
import store from '@/store'
import '@/styles/globals.css'

function ThemedApp() {
  // lê tema do Redux (uiSlice)
  const mode = useAppSelector(s => s.ui.theme) // 'light' | 'dark'
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { borderRadius: 8 },
      }}
    >
      <App />
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* ThemedApp precisa acessar store, então fica dentro do Provider */}
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
