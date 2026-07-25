import { useAuth } from '../../features/auth/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <span>GovHelpDesk</span>
      <div>
        <span style={{ marginRight: '1rem' }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </header>
  )
}