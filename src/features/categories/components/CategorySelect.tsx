import { useCategoryTree } from '../hooks/useCategoryTree'
import { flattenCategories, indentedLabel } from '../utils/flattenCategories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NONE_VALUE = '__NONE__'

interface CategorySelectProps {
  value: number | null | undefined
  onChange: (categoryId: number | null) => void
  /** Shown as the "no category" option, e.g. "Uncategorised" on a form, "All categories" on a filter. */
  noneLabel: string
  placeholder?: string
  disabled?: boolean
  id?: string
}

/**
 * Category picker rendered as a flat, indented list rather than a full expand/collapse tree
 * widget - the category tree is shallow (max 3 levels) and small (a few dozen nodes for a
 * municipal help desk), so a simple indented Select reads just as clearly with far less UI
 * complexity.
 */
export function CategorySelect({
  value,
  onChange,
  noneLabel,
  placeholder = 'Select category',
  disabled,
  id,
}: CategorySelectProps) {
  const { data: tree, isLoading } = useCategoryTree(true)
  const flatCategories = flattenCategories(tree ?? [])

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
        <SelectItem value={NONE_VALUE}>{noneLabel}</SelectItem>
        {flatCategories.map((category) => (
          <SelectItem
            key={category.id}
            value={category.id.toString()}
            disabled={!category.active}
          >
            {indentedLabel(category)}
            {!category.active ? ' (inactive)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
