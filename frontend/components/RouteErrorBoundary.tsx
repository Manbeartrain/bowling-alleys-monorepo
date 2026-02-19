import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, WifiOff } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
}

function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false;
  const message = error.message?.toLowerCase() || '';
  return (
    message.includes('loading chunk') ||
    message.includes('dynamically imported module') ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('429') ||
    message.includes('rate limit')
  );
}

export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RouteErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
    });
  };

  handleHardRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkIssue = isChunkLoadError(this.state.error);

      return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                {isNetworkIssue ? (
                  <WifiOff className="w-6 h-6 text-destructive" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                )}
              </div>
              <CardTitle>
                {isNetworkIssue ? "Connection Issue" : "Something Went Wrong"}
              </CardTitle>
              <CardDescription>
                {isNetworkIssue 
                  ? "We're having trouble loading this page. This could be a temporary network issue."
                  : "We encountered an unexpected error while loading this page."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="w-full"
                  data-testid="button-retry-page"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={this.handleHardRefresh}
                    className="flex-1"
                    data-testid="button-refresh-page"
                  >
                    Refresh Page
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={this.handleGoHome}
                    className="flex-1"
                    data-testid="button-go-home"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>

              {isNetworkIssue && (
                <p className="text-xs text-muted-foreground text-center">
                  If this persists, check your internet connection or try again in a few moments.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
