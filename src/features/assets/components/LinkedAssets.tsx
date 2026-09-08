import { useState } from 'react'
import { useTicketAssets, useLinkAssetToTicket, useUnlinkAssetFromTicket } from '../hooks/useTicketAssets'
import { AssetSelect } from './AssetSelect'
import { getAssetStatusBadgeClasses, getWarrantyBadgeClasses, formatWarrantyStatus } from '../utils/badgeVariants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function LinkedAssets({ ticketId }: { ticketId: number }) {
  const { data: linkedAssets, isLoading } = useTicketAssets(ticketId)
  const linkAsset = useLinkAssetToTicket(ticketId)
  const unlinkAsset = useUnlinkAssetFromTicket(ticketId)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)

  function handleLink() {
    if (selectedAssetId == null) return
    linkAsset.mutate(selectedAssetId, { onSuccess: () => setSelectedAssetId(null) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Linked Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading linked assets...</p>}

        {!isLoading && linkedAssets?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No assets linked yet. Link the device this ticket concerns for warranty and history
            context.
          </p>
        )}

        {(linkedAssets ?? []).map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between gap-4 rounded-md border p-3 text-sm"
          >
            <div className="space-y-1">
              <Link to={`/admin/assets/${asset.id}`} className="font-medium hover:underline">
                {asset.assetTag} - {asset.name}
              </Link>
              <div className="flex gap-2">
                <Badge className={getAssetStatusBadgeClasses(asset.status)}>
                  {asset.status.replace('_', ' ')}
                </Badge>
                <Badge className={getWarrantyBadgeClasses(asset.warrantyStatus)}>
                  Warranty: {formatWarrantyStatus(asset.warrantyStatus)}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => unlinkAsset.mutate(asset.id)}
              disabled={unlinkAsset.isPending}
            >
              Unlink
            </Button>
          </div>
        ))}

        <div className="flex items-end gap-2 pt-2 border-t">
          <div className="flex-1">
            <AssetSelect
              value={selectedAssetId}
              onChange={setSelectedAssetId}
              excludeIds={(linkedAssets ?? []).map((a) => a.id)}
              placeholder="Select an asset to link"
            />
          </div>
          <Button onClick={handleLink} disabled={selectedAssetId == null || linkAsset.isPending}>
            {linkAsset.isPending ? 'Linking...' : 'Link'}
          </Button>
        </div>

        {linkAsset.isError && (
          <p role="alert" className="text-sm text-destructive">
            Couldn't link that asset - it may already be linked to this ticket.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
