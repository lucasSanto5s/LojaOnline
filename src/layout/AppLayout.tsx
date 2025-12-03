import React from 'react'
import { Layout } from 'antd'
import HeaderBar from './HeaderBar'

const { Header, Content, Footer } = Layout

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        // REMOVE o background aqui para que apenas o Footer seja cinza
        background: 'transparent',
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
          paddingBlock: 0,                   // ⬅ remove o "padding" vertical que empurrava a busca pra cima
          display: 'flex',
          alignItems: 'center',              // ⬅ centraliza verticalmente TUDO
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        {/* HeaderBar herda height do Header e já alinha os itens */}
        <HeaderBar />
      </Header>

      {/* Área de conteúdo com fundo BRANCO */}
      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: '24px 40px',
          background: 'white',  // ⬅ FUNDO BRANCO AQUI
        }}
      >
        {children}
      </Content>

      {/* Footer mantém o fundo cinza */}
      <Footer
        style={{
          textAlign: 'center',
          padding: '12px 0',
          fontSize: 13,
          opacity: 0.8,
          background: '#f5f5f5',  // ⬅ FUNDO CINZA APENAS NO FOOTER
          color: '#666',
        }}
      >
        IFSC ©2025 Created by João Arbegaus, Kauan Koech, Lucas Borges
      </Footer>
    </Layout>
  )
}

export default AppLayout