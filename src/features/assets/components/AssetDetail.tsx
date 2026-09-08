import { useParams, Link } from 'react-router-dom'
import { useAsset, useAssetTicketHistory } from '../hooks/useAsset'
import { useUpdateAsset, useRetireAsset } from '../hooks/useAssetManagement'
import { useUsers } from '../../users/hooks/useUsers'
import { useAuth } from '../../auth/context/useAuth'
import {
  getAssetStatusBadgeClasses,
  getWarrantyBadgeClasses,
  formatWarrantyStatus,
  formatAssetType,
} from '../utils/badgeVariants'
import type { AssetStatus } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const UNASSIGNED = '__UNASSIGNED__'

export function AssetDetail() {
  const { id } = useParams<{ id: string }>()
  const assetId = Number(id)
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const { data: asset, isLoading, isError } = useAsset(assetId)
  const { data: history } = useAssetTicketHistory(assetId)
  const { data: usersPage } = useUsers(0, 100)
  const updateAsset = useUpdateAsset()
  const retireAsset = useRetireAsset()

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading asset...</p>
  if (isError || !asset) return <p className="p-6 text-destructive">Asset not found.</p>

  function handleStatusChange(status: string | null) {
    if (!status) return
    updateAsset.mutate({ id: assetId, payload: { status: status as AssetStatus } })
  }

  function handleOwnerChange(value: string | null) {
    if (!value || value === UNASSIGNED) {
      updateAsset.mutate({ id: assetId, payload: { clearAssignedUser: true } })
      return
    }
    updateAsset.mutate({ id: assetId, payload: { assignedUserId: Number(value) } })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">{asset.assetTag}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Badge className={getAssetStatusBadgeClasses(asset.status)}>
                {asset.status.replace('_', ' ')}
              </Badge>
              <Badge className={getWarrantyBadgeClasses(asset.warrantyStatus)}>
                Warranty: {formatWarrantyStatus(asset.warrantyStatus)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground pb-2 border-b">
            <p><span className="font-medium text-foreground">Type:</span> {formatAssetType(asset.type)}</p>
            <p><span className="font-medium text-foreground">Serial Number:</span> {asset.serialNumber ?? 'Not recorded'}</p>
            <p><span className="font-medium text-foreground">Manufacturer:</span> {asset.manufacturer ?? '-'}</p>
            <p><span className="font-medium text-foreground">Model:</span> {asset.model ?? '-'}</p>
            <p><span className="font-medium text-foreground">Location:</span> {asset.location ?? 'Not recorded'}</p>
            <p><span className="font-medium text-foreground">Vendor:</span> {asset.vendor ?? '-'}</p>
            <p><span className="font-medium text-foreground">Purchase Date:</span> {asset.purchaseDate ?? '-'}</p>
            <p><span className="font-medium text-foreground">Purchase Cost:</span> {asset.purchaseCost != null ? `R ${asset.purchaseCost.toFixed(2)}` : '-'}</p>
            <p><span className="font-medium text-foreground">Warranty Expiry:</span> {asset.warrantyExpiryDate ?? 'Not recorded'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={asset.status} onValueChange={handleStatusChange} disabled={updateAsset.isPending}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="IN_STORAGE">In Storage</SelectItem>
                  <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Assigned To</Label>
              <Select
                value={asset.assignedUser ? asset.assignedUser.id.toString() : UNASSIGNED}
                onValueChange={handleOwnerChange}
                disabled={updateAsset.isPending}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {(usersPage?.content ?? []).map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {asset.notes && (
            <p className="pt-2 border-t"><span className="font-medium text-foreground">Notes:</span> {asset.notes}</p>
          )}

          {asset.status !== 'RETIRED' && isAdmin && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => retireAsset.mutate(assetId)}
              disabled={retireAsset.isPending}
            >
              Retire Asset
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Device History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(history?.content ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No tickets have been linked to this asset yet.</p>
          )}
          {(history?.content ?? []).map((entry) => (
            <Link
              key={entry.ticketId}
              to={`/tickets/${entry.ticketId}`}
              className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
            >
              <span>{entry.subject}</span>
              <span className="text-muted-foreground">
                {entry.status.replace('_', ' ')} - {new Date(entry.linkedAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
