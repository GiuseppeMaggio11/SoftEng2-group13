import React from "react";
import { Alert } from "react-bootstrap";

function ErrorComp() {
  return (
    <Alert variant="danger">
      <Alert.Heading>Errore!</Alert.Heading>
      <p>Si è verificato un errore imprevisto, riprovare</p>
    </Alert>
  );
}

export default ErrorComp;
