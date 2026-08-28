import { useState } from 'react'
import { useCreateCategory } from '../hooks/useCategoryManagement'
import { CategorySelect } from './CategorySelect'
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

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<number | null>(null)
  const [defaultDepartment, setDefaultDepartment] = useState('')
  const createCategory = useCreateCategory()

  function resetAndClose() {
    setOpen(false)
    setName('')
    setParentId(null)
    setDefaultDepartment('')
  }

  function handleSubmit() {
    if (!name.trim()) return
    createCategory.mutate(
      {
        name: name.trim(),
        parentId: parentId ?? undefined,
        defaultDepartment: defaultDepartment.trim() || undefined,
      },
      { onSuccess: resetAndClose }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>New Category</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Laptop"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-parent">Parent</Label>
            <CategorySelect
              id="category-parent"
              value={parentId}
              onChange={setParentId}
              noneLabel="Top level (no parent)"
              placeholder="Top level (no parent)"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-department">Default routing department</Label>
            <Input
              id="category-department"
              value={defaultDepartment}
              onChange={(e) => setDefaultDepartment(e.target.value)}
              placeholder="Optional - leave blank to inherit from parent"
            />
          </div>

          {createCategory.isError && (
            <p role="alert" className="text-sm text-destructive">
              Failed to create category. It may already exist at this level, or the parent may be
              at maximum depth.
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || createCategory.isPending}
            className="w-full"
          >
            {createCategory.isPending ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
