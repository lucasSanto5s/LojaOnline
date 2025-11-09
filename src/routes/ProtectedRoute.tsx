import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'

const ProtectedRoute: React.FC = () => {
  const isAuth = useAppSelector(s => !!s.auth.currentUser)
  const location = useLocation()
  return isAuth ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
export default ProtectedRoute
