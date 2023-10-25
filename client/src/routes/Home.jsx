import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const buttonStyle = {
  margin: "8px",
};

function Home() {
  return (
    <Container style={containerStyle}>
      <h2>This is the Home page</h2>
      <Link to="/customer" className="m-1">
        <Button style={buttonStyle}>Customer Interface</Button>
      </Link>
      <Link to="/ticketnumber" className="m-1">
        <Button style={buttonStyle}>Get Ticket Number</Button>
      </Link>
      <Link to="/counterofficier" className="m-1">
        <Button>Counter Officier</Button>
        </Link>
      <Link to="/manager" className="m-1">
        <Button style={buttonStyle}>Manager Interface</Button>
      </Link>
      {/*add other buttons*/}
    </Container>
  );
}

export default Home;