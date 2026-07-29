import { useEffect, useState, type ReactNode } from 'react'
import { setAccessToken } from '../../../shared/lib/axiosClient'
import { login as loginApi, refresh as refreshApi, logout as logoutApi } from '../api/authApi'
import { AuthContext } from './AuthContext'
import type { UserResponse } from '../../users/types'
import type { LoginRequest } from '../api/authApi'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load, try to silently restore the session using the stored refresh token
  useEffect(() => {
    async function restoreSession() {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (!storedRefreshToken) {
        setIsLoading(false)
        return
      }

      try {
        const authResponse = await refreshApi(storedRefreshToken)
        setAccessToken(authResponse.accessToken)
        localStorage.setItem('refreshToken', authResponse.refreshToken)
        setUser(authResponse.user)
      } catch {
        // Stored refresh token is invalid/expired - clear it, user must log in fresh
        localStorage.removeItem('refreshToken')
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function login(credentials: LoginRequest) {
    const authResponse = await loginApi(credentials)
    setAccessToken(authResponse.accessToken)
    localStorage.setItem('refreshToken', authResponse.refreshToken)
    setUser(authResponse.user)
  }

  async function logout() {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (storedRefreshToken) {
      try {
        await logoutApi(storedRefreshToken)
      } catch {
        // Even if the server call fails, still clear local state
      }
    }
    setAccessToken(null)
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}