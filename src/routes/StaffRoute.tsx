import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import type { ReactNode } from 'react'

/** Like AdminRoute, but for pages the backend restricts to hasAnyRole('AGENT', 'ADMIN') rather than ADMIN only. */
export function StaffRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <p className="p-6 text-muted-foreground">Loading...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'AGENT') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
