import { Alert, Container, Button } from "react-bootstrap";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { useState, useEffect } from "react";

function Customer() {
  const [number, setNumber] = useState({count:0});
  const [error, setError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  async function handleNewTicket(){
    let newNum = await API.newCustomer("Q1");
    setNumber({count: newNum})
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 1500);
  }

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const objInitialNumber = await API.getLastTicket('Q1');
        console.log(objInitialNumber.count)
        if(objInitialNumber.count)
          setNumber(objInitialNumber);

      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    getTicketNumber();
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      {!showThankYou && number.count!=0 && <h2>Hello, we are serving the client number</h2>}
      {!showThankYou && number.count==0 && <h2>Hello, no clients are in line</h2>}
      {error ? <ErrorComp /> : !showThankYou && <NumberDisplay number={number.count} />}
      {!showThankYou && <Button variant="primary" onClick={handleNewTicket}>Get a new ticket</Button>}
      {showThankYou && <h1>Thank you!</h1>}
    </Container>
  );
  }


  const NumberDisplay = ({ number }) => {
    const numberStyle = {
      fontSize: "3em",
      fontWeight: "bold",
      color: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "200px",
    };
  
    return <div style={numberStyle}>{number}</div>;
  };

export default Customer;