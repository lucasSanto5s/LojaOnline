import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store'

const AdminRoute: React.FC = () => {
  const user = useAppSelector(s => s.auth.currentUser)
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
export default AdminRoute
