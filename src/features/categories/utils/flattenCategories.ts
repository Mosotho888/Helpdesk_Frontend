import type { CategoryResponse } from '../types'

export interface FlatCategory {
  id: number
  name: string
  level: number
  active: boolean
  parentId: number | null
  defaultDepartment: string | null
}

/** Depth-first flattening: each parent is immediately followed by its own children. */
export function flattenCategories(tree: CategoryResponse[]): FlatCategory[] {
  const result: FlatCategory[] = []

  function visit(node: CategoryResponse) {
    result.push({
      id: node.id,
      name: node.name,
      level: node.level,
      active: node.active,
      parentId: node.parentId,
      defaultDepartment: node.defaultDepartment,
    })
    node.children.forEach(visit)
  }

  tree.forEach(visit)
  return result
}

/** Renders a dropdown-safe label that hints at nesting depth without needing a real tree widget. */
export function indentedLabel(category: FlatCategory): string {
  if (category.level === 0) {
    return category.name
  }
  return '\u00A0\u00A0'.repeat(category.level) + '\u21B3 ' + category.name
}
