import { Alert, Container, Button } from "react-bootstrap";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { useState, useEffect } from "react";

function Customer() {
  const [number, setNumber] = useState({ num: 1 });
  const [error, setError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  function handleNewTicket(){
    //let newNum = API.newTicketNumber();
    console.log('new ticket')
    let newNum = { ...number }; //mock
    newNum.num +=1;
    setNumber(newNum)
    console.log(newNum.num)
    //printTheTicket()
    setShowThankYou(true);

    setTimeout(() => {
      setShowThankYou(false);
    }, 1500);
  }
  let fakeNumber={num:1};

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        //const objNumber = await API.getTicketNumber();
        //setNumber(objNumber.num);
        setNumber(fakeNumber)
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    getTicketNumber();
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      {!showThankYou && <h2>Hello, we are serving the client number</h2>}
      {error ? <ErrorComp /> : !showThankYou && <NumberDisplay number={number.num} />}
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