import { useState } from 'react'
import { useAgentsList, useUpdateAgent } from '../hooks/useAgentManagement'
import type { AgentAvailability } from '../types'
import { CreateAgentDialog } from './CreateAgentDialog'
import { AgentStatsDialog } from './AgentStatsDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AgentManagement() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useAgentsList(page)
  const updateAgent = useUpdateAgent()

  function handleAvailabilityChange(agentId: number, value: string | null) {
    if (!value) return
    updateAgent.mutate({ agentId, payload: { availability: value as AgentAvailability } })
  }

  function handleDepartmentBlur(agentId: number, currentDepartment: string | null, newValue: string) {
    if (newValue === (currentDepartment ?? '')) return // no change, skip the call
    updateAgent.mutate({ agentId, payload: { department: newValue } })
  }

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading agents...</p>
  if (isError) return <p className="p-6 text-destructive">Failed to load agents.</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Agent Management</h1>
        <CreateAgentDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.content.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.user.name}</TableCell>
                <TableCell>
                  <Input
                    defaultValue={agent.department ?? ''}
                    onBlur={(e) => handleDepartmentBlur(agent.id, agent.department, e.target.value)}
                    className="max-w-[160px] h-8"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={agent.availability ?? 'OFFLINE'}
                    onValueChange={(v) => handleAvailabilityChange(agent.id, v)}
                    disabled={updateAgent.isPending}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="BUSY">Busy</SelectItem>
                      <SelectItem value="AWAY">Away</SelectItem>
                      <SelectItem value="OFFLINE">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <AgentStatsDialog agentId={agent.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={data?.first}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page + 1} of {data?.totalPages ?? 1}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={data?.last}>
          Next
        </Button>
      </div>
    </div>
  )
}