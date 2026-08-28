export interface CategoryResponse {
  id: number
  name: string
  slug: string
  parentId: number | null
  level: number
  defaultDepartment: string | null
  active: boolean
  children: CategoryResponse[]
}

// Ticket-facing view embedded on TicketResponse.category - flat, with a breadcrumb path
// (e.g. "Hardware > Laptop") rather than the full tree.
export interface CategorySummaryResponse {
  id: number
  name: string
  path: string
}

export interface CreateCategoryRequest {
  name: string
  parentId?: number
  defaultDepartment?: string
}

export interface UpdateCategoryRequest {
  name?: string
  defaultDepartment?: string
  active?: boolean
}
