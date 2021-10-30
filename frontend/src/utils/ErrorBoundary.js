import React from "react";
import { Container } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mx-auto my-4 text-center">
          <h2>
            Something went wrong. We are sorry. Please refresh the page and
            contact the system administrator if the issue persists.
          </h2>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
