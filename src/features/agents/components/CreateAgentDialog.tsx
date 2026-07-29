import { useState } from 'react'
import { useUsers } from '../../users/hooks/useUsers'
import { useAgentsList, useCreateAgent } from '../hooks/useAgentManagement'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CreateAgentDialog() {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { data: usersData } = useUsers(0, 100)
  const { data: agentsData } = useAgentsList(0, 100)
  const createAgent = useCreateAgent()

  const existingAgentUserIds = new Set(agentsData?.content.map((a) => a.user.id))
  const eligibleUsers = usersData?.content.filter((u) => !existingAgentUserIds.has(u.id)) ?? []

  function handleSubmit() {
    if (!selectedUserId) return
    createAgent.mutate(
      { userId: Number(selectedUserId), availability: 'OFFLINE' },
      { onSuccess: () => { setOpen(false); setSelectedUserId(null) } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Register Agent</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>User</Label>
            <Select value={selectedUserId ?? ''} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user to register as agent" />
              </SelectTrigger>
              <SelectContent>
                {eligibleUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.name} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {createAgent.isError && (
            <p role="alert" className="text-sm text-destructive">Failed to register agent.</p>
          )}
          <Button onClick={handleSubmit} disabled={!selectedUserId || createAgent.isPending} className="w-full">
            {createAgent.isPending ? 'Registering...' : 'Register Agent'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}