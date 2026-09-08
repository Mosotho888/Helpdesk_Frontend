import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAssets } from '../hooks/useAssets'
import { CreateAssetDialog } from './CreateAssetDialog'
import { useAuth } from '../../auth/context/useAuth'
import { getAssetStatusBadgeClasses, getWarrantyBadgeClasses, formatWarrantyStatus, formatAssetType } from '../utils/badgeVariants'
import type { AssetType, AssetStatus } from '../types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AssetManagement() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState<AssetType | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL')

  const { data, isLoading, isError } = useAssets({
    type: typeFilter === 'ALL' ? undefined : typeFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    size: 20,
  })

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading assets...</p>
  if (isError) return <p className="p-6 text-destructive">Failed to load assets.</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Asset Management</h1>
          <p className="text-sm text-muted-foreground">
            Register and track IT assets - laptops, desktops, printers, monitors, networking
            equipment, and software licenses.
          </p>
        </div>
        {isAdmin && <CreateAssetDialog />}
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as AssetType | 'ALL'); setPage(0) }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="LAPTOP">Laptop</SelectItem>
            <SelectItem value="DESKTOP">Desktop</SelectItem>
            <SelectItem value="PRINTER">Printer</SelectItem>
            <SelectItem value="MONITOR">Monitor</SelectItem>
            <SelectItem value="NETWORKING_EQUIPMENT">Networking Equipment</SelectItem>
            <SelectItem value="SOFTWARE_LICENSE">Software License</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as AssetStatus | 'ALL'); setPage(0) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="IN_USE">In Use</SelectItem>
            <SelectItem value="IN_STORAGE">In Storage</SelectItem>
            <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
            <SelectItem value="RETIRED">Retired</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.content ?? []).map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-mono text-xs">
                  <Link to={`/admin/assets/${asset.id}`} className="hover:underline">
                    {asset.assetTag}
                  </Link>
                </TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell className="text-muted-foreground">{formatAssetType(asset.type)}</TableCell>
                <TableCell>
                  <Badge className={getAssetStatusBadgeClasses(asset.status)}>
                    {asset.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getWarrantyBadgeClasses(asset.warrantyStatus)}>
                    {formatWarrantyStatus(asset.warrantyStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {asset.assignedUser?.name ?? 'Unassigned'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {(data?.number ?? 0) + 1} of {Math.max(data?.totalPages ?? 1, 1)}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={data?.first} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={data?.last} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
