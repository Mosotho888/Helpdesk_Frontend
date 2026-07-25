import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { LoginPage } from './features/auth/components/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { TicketTable } from './features/tickets/components/TicketTable'
import { TicketDetail } from './features/tickets/components/TicketDetail'
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
                <TicketTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <Header />
                <TicketDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App