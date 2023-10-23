import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Button } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <h2>This is the Home page.</h2>
      <Link to="/customer"><Button>Customer Interface</Button></Link>
       {/*add other buttons*/}
    </Container>
  );
}


export default Home;