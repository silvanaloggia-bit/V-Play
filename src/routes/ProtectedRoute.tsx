import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types/user'

interface ProtectedRouteProps {
  allowedRoles: Role[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { loggedUser } = useAuth()

  if (!loggedUser) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(loggedUser.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
