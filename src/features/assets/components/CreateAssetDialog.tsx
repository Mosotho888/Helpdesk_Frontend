import { useState } from 'react'
import { useCreateAsset } from '../hooks/useAssetManagement'
import { useUsers } from '../../users/hooks/useUsers'
import type { AssetType } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'PRINTER', label: 'Printer' },
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'NETWORKING_EQUIPMENT', label: 'Networking Equipment' },
  { value: 'SOFTWARE_LICENSE', label: 'Software License' },
  { value: 'OTHER', label: 'Other' },
]

const UNASSIGNED = '__UNASSIGNED__'

export function CreateAssetDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<AssetType>('LAPTOP')
  const [serialNumber, setSerialNumber] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [model, setModel] = useState('')
  const [assignedUserId, setAssignedUserId] = useState<string>(UNASSIGNED)
  const [location, setLocation] = useState('')
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('')

  const { data: usersPage } = useUsers(0, 100)
  const createAsset = useCreateAsset()

  function reset() {
    setName('')
    setType('LAPTOP')
    setSerialNumber('')
    setManufacturer('')
    setModel('')
    setAssignedUserId(UNASSIGNED)
    setLocation('')
    setWarrantyExpiryDate('')
  }

  function handleSubmit() {
    if (!name.trim()) return
    createAsset.mutate(
      {
        name: name.trim(),
        type,
        serialNumber: serialNumber.trim() || undefined,
        manufacturer: manufacturer.trim() || undefined,
        model: model.trim() || undefined,
        assignedUserId: assignedUserId === UNASSIGNED ? undefined : Number(assignedUserId),
        location: location.trim() || undefined,
        warrantyExpiryDate: warrantyExpiryDate || undefined,
      },
      { onSuccess: () => { setOpen(false); reset() } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Register Asset</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Asset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="asset-name">Name</Label>
              <Input
                id="asset-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dell Latitude 5420 - Finance"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-type">Type</Label>
              <Select value={type} onValueChange={(v) => v && setType(v as AssetType)}>
                <SelectTrigger id="asset-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-serial">Serial Number</Label>
              <Input
                id="asset-serial"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-manufacturer">Manufacturer</Label>
              <Input
                id="asset-manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-model">Model</Label>
              <Input
                id="asset-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-owner">Assigned To</Label>
              <Select
                value={assignedUserId}
                onValueChange={(v) => setAssignedUserId(v ?? UNASSIGNED)}
              >
                <SelectTrigger id="asset-owner">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {(usersPage?.content ?? []).map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-location">Location</Label>
              <Input
                id="asset-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asset-warranty">Warranty Expiry</Label>
              <Input
                id="asset-warranty"
                type="date"
                value={warrantyExpiryDate}
                onChange={(e) => setWarrantyExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {createAsset.isError && (
            <p role="alert" className="text-sm text-destructive">
              Failed to register asset. The serial number may already be in use.
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || createAsset.isPending}
            className="w-full"
          >
            {createAsset.isPending ? 'Registering...' : 'Register Asset'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
