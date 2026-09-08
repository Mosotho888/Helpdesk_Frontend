import { useAuth } from '../../features/auth/context/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'
  const isStaff = user?.role === 'ADMIN' || user?.role === 'AGENT'

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* App Logo */}
        <Link to="/" className="font-bold text-lg tracking-tight">
          GovHelpDesk
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Primary Action Button */}
          <Button
            size="sm"
            nativeButton={false}
            render={<Link to="/tickets/new" />}
          >
            + New Ticket
          </Button>

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              nativeButton={false}
              render={
                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                  {user?.name || 'Account'}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-48">
              {/* Group wrapper fixes the Base UI context requirement */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                nativeButton={false}
                render={<Link to="/profile" />}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>

              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    nativeButton={false}
                    render={<Link to="/admin/users" />}
                    className="cursor-pointer"
                  >
                    Manage Users
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    nativeButton={false}
                    render={<Link to="/admin/agents" />}
                    className="cursor-pointer"
                  >
                    Manage Agents
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    nativeButton={false}
                    render={<Link to="/admin/categories" />}
                    className="cursor-pointer"
                  >
                    Manage Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    nativeButton={false}
                    render={<Link to="/admin/audit" />}
                    className="cursor-pointer"
                  >
                    Audit Reports
                  </DropdownMenuItem>
                </>
              )}

              {isStaff && !isAdmin && <DropdownMenuSeparator />}

              {isStaff && (
                <DropdownMenuItem
                  nativeButton={false}
                  render={<Link to="/admin/assets" />}
                  className="cursor-pointer"
                >
                  Manage Assets
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}