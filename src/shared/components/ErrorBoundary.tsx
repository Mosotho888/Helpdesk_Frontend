import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Uncaught error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <p className="text-destructive font-medium">Something went wrong.</p>
          <p className="text-sm text-muted-foreground mt-1">Please refresh the page and try again.</p>
        </div>
      )
    }
    return this.props.children
  }
}