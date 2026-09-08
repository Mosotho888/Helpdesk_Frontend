import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthProvider'
import { LoginPage } from './features/auth/components/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { TicketTable } from './features/tickets/components/TicketTable'
import { TicketDetail } from './features/tickets/components/TicketDetail'
import { CreateTicketForm } from './features/tickets/components/CreateTicketForm'
import { AdminRoute } from './routes/AdminRoute'
import { StaffRoute } from './routes/StaffRoute'
import { UserManagement } from './features/users/components/UserManagement'
import { ProfileSettings } from './features/users/components/ProfileSettings'
import { AgentManagement } from './features/agents/components/AgentManagement'
import { CategoryManagement } from './features/categories/components/CategoryManagement'
import { AssetManagement } from './features/assets/components/AssetManagement'
import { AssetDetail } from './features/assets/components/AssetDetail'
import { AuditReports } from './features/audit/components/AuditReports'
import { ForgotPasswordPage } from './features/auth/components/ForgotPasswordPage'
import { AppLayout } from './shared/components/AppLayout'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TicketTable />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents"
            element={
              <AdminRoute>
                <AppLayout>
                  <AgentManagement />
                </AppLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AppLayout>
                  <CategoryManagement />
                </AppLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/assets"
            element={
              <StaffRoute>
                <AppLayout>
                  <AssetManagement />
                </AppLayout>
              </StaffRoute>
            }
          />
          <Route
            path="/admin/assets/:id"
            element={
              <StaffRoute>
                <AppLayout>
                  <AssetDetail />
                </AppLayout>
              </StaffRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AppLayout>
                  <UserManagement />
                </AppLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <AdminRoute>
                <AppLayout>
                  <AuditReports />
                </AppLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TicketDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateTicketForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfileSettings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App