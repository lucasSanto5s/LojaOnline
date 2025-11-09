import React from 'react'
import { Layout } from 'antd'
import HeaderBar from './HeaderBar'

const { Content, Footer } = Layout

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh'}}>

      <HeaderBar />
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        IFSC ©2025 Created by João Arbegaus, Kauan Koech, Lucas Borges
      </Footer>
    </Layout>
  )
}
export default AppLayout
