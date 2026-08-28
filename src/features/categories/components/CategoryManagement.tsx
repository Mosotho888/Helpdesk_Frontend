import { useCategoryTree } from '../hooks/useCategoryTree'
import { useUpdateCategory } from '../hooks/useCategoryManagement'
import { flattenCategories, indentedLabel } from '../utils/flattenCategories'
import { CreateCategoryDialog } from './CreateCategoryDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CategoryManagement() {
  // activeOnly=false so admins can see (and reactivate) categories they previously deactivated.
  const { data: tree, isLoading, isError } = useCategoryTree(false)
  const updateCategory = useUpdateCategory()

  const categories = flattenCategories(tree ?? [])

  function handleDepartmentBlur(
    categoryId: number,
    currentDepartment: string | null,
    newValue: string
  ) {
    const trimmed = newValue.trim()
    if (trimmed === (currentDepartment ?? '')) return // no change, skip the call
    updateCategory.mutate({ id: categoryId, payload: { defaultDepartment: trimmed } })
  }

  function handleToggleActive(categoryId: number, currentlyActive: boolean) {
    updateCategory.mutate({ id: categoryId, payload: { active: !currentlyActive } })
  }

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading categories...</p>
  if (isError) return <p className="p-6 text-destructive">Failed to load categories.</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Category Management</h1>
          <p className="text-sm text-muted-foreground">
            Organise tickets into hierarchical categories and set the department each one routes
            to by default.
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      {updateCategory.isError && (
        <p role="alert" className="text-sm text-destructive">
          That change couldn't be applied. A category with active subcategories can't be
          deactivated, and names must be unique among siblings.
        </p>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Default department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  <span className={category.level === 0 ? 'font-semibold' : 'text-muted-foreground'}>
                    {indentedLabel(category)}
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    defaultValue={category.defaultDepartment ?? ''}
                    key={`${category.id}-dept-${category.defaultDepartment ?? ''}`}
                    onBlur={(e) =>
                      handleDepartmentBlur(category.id, category.defaultDepartment, e.target.value)
                    }
                    placeholder="Not set"
                    className="max-w-[200px] h-8"
                  />
                </TableCell>
                <TableCell>
                  <Badge variant={category.active ? 'default' : 'secondary'}>
                    {category.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(category.id, category.active)}
                    disabled={updateCategory.isPending}
                  >
                    {category.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
