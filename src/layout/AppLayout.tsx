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
          background: '#e6f4ff', // azul claro do exemplo
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          paddingInline: 32,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0 1px 4px',
        }}
      >
        <HeaderBar />
      </Header>

      {/* ⚠️ removemos o max-width padrão e expandimos o conteúdo */}
      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: '24px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
