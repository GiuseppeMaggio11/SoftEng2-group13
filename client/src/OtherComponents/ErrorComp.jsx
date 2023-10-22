import React from "react";
import { Alert } from "react-bootstrap";

function ErrorComp() {
  return (
    <Alert variant="danger">
      <Alert.Heading>Error!</Alert.Heading>
      <p>An unexpected error occurred, please try again.</p>
    </Alert>
  );
}

export default ErrorComp;
