import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppExceptionPage } from './pages/AppExceptionPage';
import { recordMonitoredError } from '../../utils/errorMonitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log privately to internal console and monitoring buffer without exposing traces to visitor UI
    console.error('[ErrorBoundary caught error]:', error.message, errorInfo.componentStack);
    recordMonitoredError('boundary', error.message || 'Component render failure');
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public handleResetState = () => {
    this.setState({ hasError: false, error: null });
  };

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.handleResetState);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <AppExceptionPage
          onReload={this.handleReload}
          onReturnHome={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
