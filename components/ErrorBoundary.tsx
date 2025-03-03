import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary: Error caught in getDerivedStateFromError", error)
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary: Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Sorry.. there was an error</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

