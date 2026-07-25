import { useState } from 'react'
import apiClient, { setAccessToken } from './shared/lib/axiosClient'
import { TicketList } from './features/tickets/components/TicketList'

function App() {
  const [result, setResult] = useState<string>('')

  async function testLogin() {
    try {
      const response = await apiClient.post('/auth/login', {
        email: 'admin@helpdesk.gov.za',
        password: 'Admin@1234',
      })
      setAccessToken(response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      setResult(`Success! Logged in as ${response.data.user.name}`)
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'unknown error'}`)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>GovHelpDesk</h1>
      <button onClick={testLogin}>Test Login</button>
      <p>{result}</p>
      <TicketList />
    </div>
  )
}

export default App