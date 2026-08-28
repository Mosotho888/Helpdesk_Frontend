import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button nativeButton={false} render={<Link to="/" />}>
        Back to tickets
      </Button>
    </div>
  )
}