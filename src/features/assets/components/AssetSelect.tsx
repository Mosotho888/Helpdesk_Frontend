import { useAssets } from '../hooks/useAssets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AssetSelectProps {
  value: number | null
  onChange: (assetId: number | null) => void
  /** Asset ids to exclude from the list, e.g. ones already linked to the current ticket. */
  excludeIds?: number[]
  placeholder?: string
  disabled?: boolean
  id?: string
}

const NONE_VALUE = '__NONE__'

/**
 * Fetches a larger page (100) rather than the default 20, mirroring how useAgents(page, 100) is
 * used elsewhere for picker contexts - the backend has no name-search endpoint for assets, so a
 * bigger single page is the simplest way to make most of an organisation's inventory selectable.
 */
export function AssetSelect({
  value,
  onChange,
  excludeIds = [],
  placeholder = 'Select an asset',
  disabled,
  id,
}: AssetSelectProps) {
  const { data, isLoading } = useAssets({ size: 100 })
  const excluded = new Set(excludeIds)
  const options = (data?.content ?? []).filter((asset) => !excluded.has(asset.id))

  function handleChange(next: string | null) {
    if (!next || next === NONE_VALUE) {
      onChange(null)
      return
    }
    onChange(Number(next))
  }

  return (
    <Select
      value={value != null ? value.toString() : NONE_VALUE}
      onValueChange={handleChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 && (
          <SelectItem value={NONE_VALUE} disabled>
            {isLoading ? 'Loading assets...' : 'No assets available'}
          </SelectItem>
        )}
        {options.map((asset) => (
          <SelectItem key={asset.id} value={asset.id.toString()}>
            {asset.assetTag} - {asset.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
