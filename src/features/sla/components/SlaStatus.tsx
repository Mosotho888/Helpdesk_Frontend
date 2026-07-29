import { useTicketSla } from '../hooks/useTicketSla'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SlaStatus({ ticketId }: { ticketId: number }) {
  const { data, isLoading, isError } = useTicketSla(ticketId)

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading SLA status...</p>
  if (isError || !data) return null

  const anyBreached = data.responseBreached || data.resolutionBreached

  return (
    <Card className={cn(anyBreached && 'border-red-300 bg-red-50')}>
      <CardHeader>
        <CardTitle className="text-base">SLA Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <p>
          Response due: {new Date(data.responseDueAt).toLocaleString()}
          {data.responseBreached && (
            <span className="ml-2 font-semibold text-red-700">BREACHED</span>
          )}
        </p>
        <p>
          Resolution due: {new Date(data.resolutionDueAt).toLocaleString()}
          {data.resolutionBreached && (
            <span className="ml-2 font-semibold text-red-700">BREACHED</span>
          )}
        </p>
        {data.firstResponseAt && (
          <p className="text-muted-foreground">First response: {new Date(data.firstResponseAt).toLocaleString()}</p>
        )}
        {data.resolvedAt && (
          <p className="text-muted-foreground">Resolved: {new Date(data.resolvedAt).toLocaleString()}</p>
        )}
      </CardContent>
    </Card>
  )
}