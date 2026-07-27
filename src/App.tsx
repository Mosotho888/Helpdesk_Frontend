import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { LoginPage } from './features/auth/components/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { TicketTable } from './features/tickets/components/TicketTable'
import { TicketDetail } from './features/tickets/components/TicketDetail'
import { Header } from './shared/components/Header'
import { CreateTicketForm } from './features/tickets/components/CreateTicketForm'
import { AdminRoute } from './routes/AdminRoute'
import { UserManagement } from './features/users/components/UserManagement'
import { ProfileSettings } from './features/users/components/ProfileSettings'
import { AgentManagement } from './features/agents/components/AgentManagement'
import { AuditReports } from './features/audit/components/AuditReports'

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
            path="/admin/agents"
            element={
              <AdminRoute>
                <Header />
                <AgentManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Header />
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <AdminRoute>
                <Header />
                <AuditReports />
              </AdminRoute>
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
          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <Header />
                <CreateTicketForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App