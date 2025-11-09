import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Clients from '@/pages/Clients'
import Users from '@/pages/Users'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/clients" element={<Clients />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Apenas admin */}
      <Route element={<AdminRoute />}>
        <Route path="/users" element={<Users />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default RoutesConfig
