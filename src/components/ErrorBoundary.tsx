import React from 'react';
import { Fallback } from './Fallback';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryChildren {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryChildren, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error) {
    // TODO: Send this error to Slack service
    console.log(error.message);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
