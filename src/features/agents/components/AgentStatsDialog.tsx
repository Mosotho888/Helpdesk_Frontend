import { useState } from 'react'
import { useAgentStats } from '../hooks/useAgentManagement'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AgentStatsDialog({ agentId }: { agentId: number }) {
  const [open, setOpen] = useState(false)
  const { data: stats, isLoading } = useAgentStats(agentId, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm">View Stats</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stats?.agentName ?? 'Agent'} Statistics</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading stats...</p>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><span className="text-muted-foreground">Total assigned:</span> {stats.totalAssigned}</p>
            <p>
                <span className="text-muted-foreground">Avg. resolution:</span>{' '}
                {stats.avgResolutionHours !== null ? `${stats.avgResolutionHours.toFixed(1)}h` : 'N/A'}
            </p>
            <p><span className="text-muted-foreground">Open:</span> {stats.openCount}</p>
            <p><span className="text-muted-foreground">In Progress:</span> {stats.inProgressCount}</p>
            <p><span className="text-muted-foreground">Resolved:</span> {stats.resolvedCount}</p>
            <p><span className="text-muted-foreground">Closed:</span> {stats.closedCount}</p>
            <p><span className="text-muted-foreground">Escalated:</span> {stats.escalatedCount}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}