import React from 'react'
import { Layout } from 'antd'
import HeaderBar from './HeaderBar'

const { Header, Content, Footer } = Layout

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'var(--ant-color-bg-layout)',
      }}
    >
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#e6f4ff',            // azul claro do exemplo
          height: 64,                        // altura fixa
          paddingInline: 32,
          paddingBlock: 0,                   // ⬅ remove o “padding” vertical que empurrava a busca pra cima
          display: 'flex',
          alignItems: 'center',              // ⬅ centraliza verticalmente TUDO
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        {/* HeaderBar herda height do Header e já alinha os itens */}
        <HeaderBar />
      </Header>

      {/* Área de conteúdo expandida, como você queria */}
      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: '24px 40px',
        }}
      >
        {children}
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          padding: '12px 0',
          fontSize: 13,
          opacity: 0.8,
        }}
      >
        IFSC ©2025 Created by João Arbegaus, Kauan Koech, Lucas Borges
      </Footer>
    </Layout>
  )
}

export default AppLayout
