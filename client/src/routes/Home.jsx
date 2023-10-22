import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container>
      <h2>This is the Home page.</h2>
      <Link to="/customer">
        <Button>Customer Interface</Button>
      </Link>
      <Link to="/ticketnumber">
        <Button>Get Ticket Number</Button>
      </Link>
      {/*add other buttons*/}
    </Container>
  );
}

export default Home;
