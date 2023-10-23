import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container>
      <h2>This is the Home page.</h2>
      <Link to="/customer" className="m-1">
        <Button>Customer Interface</Button>
      </Link>
      <Link to="/ticketnumber" className="m-1">
        <Button>Get Ticket Number</Button>
      </Link>
      <Link to="/counterofficier" className="m-1">
        <Button>Counter Officier</Button>
      </Link>
      {/*add other buttons*/}
    </Container>
  );
}

export default Home;
