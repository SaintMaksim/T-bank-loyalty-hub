import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary:', error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page shell center">
          <h2>Что-то пошло не так</h2>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Обновить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;