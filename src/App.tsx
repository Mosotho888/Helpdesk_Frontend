import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { LoginPage } from './features/auth/components/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { TicketList } from './features/tickets/components/TicketList'
import { Header } from './shared/components/Header'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Header />
                <TicketList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App