import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

let accessToken: string | null = null
let refreshPromise: Promise<string> | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    indexes: null, // renders arrays as repeated params: sort=x&sort=y, not sort[]=x&sort[]=y
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token available')

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  })

  const newAccessToken = response.data.accessToken
  const newRefreshToken = response.data.refreshToken

  setAccessToken(newAccessToken)
  localStorage.setItem('refreshToken', newRefreshToken)

  return newAccessToken
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url ?? ''

    const isAuthEndpoint = 
      requestUrl.includes('/auth/login') || 
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/users/me/password')

    if (error.response?.status === 401 && !isAuthEndpoint && originalRequest) {
      // Only one refresh call in flight at a time; others wait on the same promise
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      try {
        const newToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest) // retry the original request
      } catch (refreshError) {
        setAccessToken(null)
        localStorage.removeItem('refreshToken')
        // redirect to login — we'll wire this to your router shortly
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient