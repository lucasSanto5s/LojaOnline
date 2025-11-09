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

  // seleciona algoritmo claro/escuro
  const algorithm =
    mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

  // aplica cor de fundo global conforme o tema
  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty(
      '--app-bg-color',
      mode === 'dark' ? '#141414' : '#f5f5f5'
    )
  }, [mode])

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          borderRadius: 8,
          colorBgLayout: 'var(--app-bg-color)',
        },
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
