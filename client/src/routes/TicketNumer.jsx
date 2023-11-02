import { useEffect, useState } from "react";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { Alert, Container } from "react-bootstrap";
import useWebSocket from "react-use-websocket";


function TicketNumber() {
  const [number, setNumber] = useState({});
  const [error, setError] = useState(false);
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
      console.log('message')
    },
  });

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const objCount = await API.getTicketNumber('Q1');
        setNumber(objCount);
        console.log(objCount.count)
      } catch (err) {
        console.log(err);
        setError(true);
      }
    }
    if (isDirty) {
      getTicketNumber();
      setIsDirty(false);
    }

  }, [isDirty]); 

  return (
    <Container className="text-center">
      <h2>Current Number</h2>
      {error ? <ErrorComp /> : <NumberDisplay number={number.count} />}
    </Container>
  );
}

const NumberDisplay = ({ number }) => {
  const numberStyle = {
    fontWeight: "bold", // Grassetto
    color: "red", // Colore specificato
    display: "flex",
    justifyContent: "center", // Allinea orizzontalmente al centro
    alignItems: "center", // Allinea verticalmente al centro
    height: "100vh", // Altezza della viewport
    fontSize: "200px",
  };

  return <div style={numberStyle}>{number}</div>;
};

export default TicketNumber;
