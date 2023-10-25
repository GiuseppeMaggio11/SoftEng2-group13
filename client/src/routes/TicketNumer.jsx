import { useEffect, useState } from "react";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { Alert, Container } from "react-bootstrap";

function TicketNumber() {
  const [number, setNumber] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const objCount = await API.getTicketNumber();
        setNumber(objCount);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    getTicketNumber();
  }, []);

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
