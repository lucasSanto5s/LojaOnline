import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntApp, theme as antdTheme } from 'antd'
import { useAppSelector } from '@/store'
import App from './App'
import store from '@/store'
import '@/styles/globals.css'

function ThemedApp() {
  const mode = useAppSelector((s) => s.ui.theme)
  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: { borderRadius: 8 },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
