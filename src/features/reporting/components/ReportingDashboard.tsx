import { useState } from 'react'
import {
  useTicketVolumeReport,
  useSlaComplianceReport,
  useAgentWorkloadReport,
  useCategoryBreakdownReport,
  useAssetSummaryReport,
  useKnowledgeBaseEffectivenessReport,
  useRefreshReports,
} from '../hooks/useReports'
import { useAuth } from '../../auth/context/useAuth'
import { TicketVolumeChart } from './TicketVolumeChart'
import { SlaComplianceChart } from './SlaComplianceChart'
import { CategoryBreakdownChart } from './CategoryBreakdownChart'
import { AgentWorkloadTable } from './AgentWorkloadTable'
import { AssetSummaryPanel } from './AssetSummaryPanel'
import { KnowledgeBaseEffectivenessTable } from './KnowledgeBaseEffectivenessTable'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const DAY_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
]

export function ReportingDashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [days, setDays] = useState(30)

  const ticketVolume = useTicketVolumeReport(days)
  const slaCompliance = useSlaComplianceReport(days)
  const agentWorkload = useAgentWorkloadReport()
  const categoryBreakdown = useCategoryBreakdownReport()
  const assetSummary = useAssetSummaryReport()
  const kbEffectiveness = useKnowledgeBaseEffectivenessReport()
  const refresh = useRefreshReports()

  const isLoading =
    ticketVolume.isLoading ||
    slaCompliance.isLoading ||
    agentWorkload.isLoading ||
    categoryBreakdown.isLoading ||
    assetSummary.isLoading ||
    kbEffectiveness.isLoading

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reporting Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Data refreshes automatically every 15 minutes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={days.toString()} onValueChange={(v) => v && setDays(Number(v))}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => refresh.mutate()}
              disabled={refresh.isPending}
            >
              {refresh.isPending ? 'Refreshing...' : 'Refresh Now'}
            </Button>
          )}
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading reports...</p>}

      {refresh.isError && (
        <p role="alert" className="text-sm text-destructive">
          Couldn't refresh the reports. Please try again.
        </p>
      )}

      {!isLoading && (
        <div className="space-y-6">
          <TicketVolumeChart data={ticketVolume.data ?? []} />
          <SlaComplianceChart data={slaCompliance.data ?? []} />
          <div className="grid md:grid-cols-2 gap-6">
            <CategoryBreakdownChart data={categoryBreakdown.data ?? []} />
            <AssetSummaryPanel data={assetSummary.data ?? []} />
          </div>
          <AgentWorkloadTable data={agentWorkload.data ?? []} />
          <KnowledgeBaseEffectivenessTable data={kbEffectiveness.data ?? []} />
        </div>
      )}
    </div>
  )
}
