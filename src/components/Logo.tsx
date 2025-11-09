import React from 'react'
import logo from '@/resources/logo.png'  // <-- importa a imagem

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <img src={logo} alt="Online Shop" style={{ height: 24 }} />
    <span style={{ fontWeight: 600 }}></span>
  </div>
)
export default Logo
