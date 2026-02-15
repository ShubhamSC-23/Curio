import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "../common/Button";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. The page encountered an error.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => (window.location.href = "/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 404 Not Found Component
export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary" onClick={() => (window.location.href = "/")}>
          <Home className="h-4 w-4 mr-2" />
          Go to Home
        </Button>
      </div>
    </div>
  );
};

// Network Error Component
export const NetworkError = ({ onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-600 mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({
  icon: Icon = AlertTriangle,
  title = "No data found",
  description = "There is nothing to display here.",
  action,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
};

// Inline Error Message
export const InlineError = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            <span className="sr-only">Dismiss</span>×
          </button>
        )}
      </div>
    </div>
  );
};

// Success Message
export const SuccessMessage = ({ message, onDismiss }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-green-500 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-green-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-green-500 hover:text-green-700"
          >
            <span className="sr-only">Dismiss</span>×
          </button>
        )}
      </div>
    </div>
  );
};

// Loading State with Retry
export const LoadingError = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <p className="text-gray-600 mb-4">
        {message || "Failed to load content"}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorBoundary;
