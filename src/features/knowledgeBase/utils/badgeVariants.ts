import type { ArticleType, ArticleStatus } from '../types'

export function getArticleStatusBadgeClasses(status: ArticleStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

export function getArticleTypeBadgeClasses(type: ArticleType): string {
  switch (type) {
    case 'TROUBLESHOOTING_GUIDE':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'FAQ':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'STANDARD_OPERATING_PROCEDURE':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'GENERAL':
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export function formatArticleType(type: ArticleType): string {
  switch (type) {
    case 'TROUBLESHOOTING_GUIDE':
      return 'Troubleshooting Guide'
    case 'FAQ':
      return 'FAQ'
    case 'STANDARD_OPERATING_PROCEDURE':
      return 'SOP'
    case 'GENERAL':
      return 'General'
  }
}
