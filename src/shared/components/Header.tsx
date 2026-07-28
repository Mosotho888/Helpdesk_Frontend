import { useAuth } from '../../features/auth/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <Link to="/" className="font-semibold text-lg">
        GovHelpDesk
      </Link>
      <div className="flex items-center gap-4">
        {user?.role === 'ADMIN' && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/admin/agents" />}>
            Manage Agents
          </Button>
        )}
        {user?.role === 'ADMIN' && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/admin/users" />}>
            Manage Users
          </Button>
        )}
        {user?.role === 'ADMIN' && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/admin/audit" />}>
            Audit Reports
          </Button>
        )}
        <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/tickets/new" />}>
          New Ticket
        </Button>
        <Link to="/profile" className="text-sm text-muted-foreground hover:underline">
          {user?.name} <span className="text-xs">({user?.role})</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  )
}