import { Alert, Container, Button } from "react-bootstrap";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";

function Customer() {
  const [number, setNumber] = useState({ count: 0 });
  const [error, setError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [numOfPeopleWaiting, setNumOfPeopleWaiting] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const WS_URL = "ws://127.0.0.1:8000";

  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });

  let { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onMessage: (message) => {
      setIsDirty(true);
    },
  });

  useEffect(() => {
    if (lastJsonMessage) {
      setIsDirty(true);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const objInitialNumber = await API.getLastTicket("Q1");
        if (objInitialNumber.count) setNumber(objInitialNumber);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    if (isDirty) {
      console.log("entro2")
      if(numOfPeopleWaiting>1)
        getTicketNumber();
      numberOfPeopleWaiting();
      setIsDirty(false);
    }
  }, [isDirty]);

  async function handleNewTicket() {
    let newNum = await API.newCustomer("Q1");
    setNumber({ count: newNum });
    numberOfPeopleWaiting();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 1500);
  }

  const numberOfPeopleWaiting = async () => {
    try {
      const lenght = await API.getQueueLenght("Q1");
      setNumOfPeopleWaiting(Number(lenght - 1));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      {!showThankYou && number.count != 0 && (
        <h2>Last client number in line is</h2>
      )}
      {!showThankYou && number.count == 0 && (
        <h2>Hello, no clients are in line</h2>
      )}
      {error ? (
        <ErrorComp />
      ) : (
        !showThankYou && <NumberDisplay number={number.count} />
      )}
      {!showThankYou && number.count != 0 && (
        <>
          <h2>number of people before you:</h2>
          <h2>{numOfPeopleWaiting + 1}</h2>
        </>
      )}
      {!showThankYou && (
        <Button variant="primary" onClick={handleNewTicket}>
          Get a new ticket
        </Button>
      )}
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
