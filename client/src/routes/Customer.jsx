import { Alert, Container, Button } from "react-bootstrap";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { useState, useEffect } from "react";

function Customer() {
  const [number, setNumber] = useState({count:0});
  const [error, setError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [numOfPeopleWaiting, setNumOfPeopleWaiting] = useState(0);

  async function handleNewTicket(){
    let newNum = await API.newCustomer("Q1");
    setNumber({count: newNum})
    numberOfPeopleWaiting();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 1500);
  }

  const numberOfPeopleWaiting = async() => {
    try{
     const lenght = await API.getQueueLenght('Q1');
     setNumOfPeopleWaiting(Number(lenght-1));
    }catch(err){
      console.log(err)
    }
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
    
    const interval = setInterval(() => {
      numberOfPeopleWaiting();
    }, 300);

    // Clear the interval when the component is unmounted or when the effect is re-run
    return () => clearInterval(interval);
  }, []); 

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      {!showThankYou && number.count!=0 && <h2>Hello, we are serving the client number</h2>}
      {!showThankYou && number.count==0 && <h2>Hello, no clients are in line</h2>}
      {error ? <ErrorComp /> : !showThankYou && <NumberDisplay number={number.count} />}
      {!showThankYou && number.count!=0 && <><h2>number of people before you:</h2><h2>{numOfPeopleWaiting + 1}</h2></>}
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