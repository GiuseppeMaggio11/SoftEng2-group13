import { useEffect, useState } from "react";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { Alert, Container } from "react-bootstrap";

function TicketNumber() {
  const [number, setNumber] = useState({ num: 1 });
  const [error, setError] = useState(false);

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const objNumber = await API.getTicketNumber();
        setNumber(objNumber.num);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    // getTicketNumber();
  }, []);

  return (
    <Container className="text-center">
      <h2>Current Number</h2>
      {error ? <ErrorComp /> : <NumberDisplay number={number.num} />}
    </Container>
  );
}

const NumberDisplay = ({ number }) => {
  const numberStyle = {
    fontSize: "3em", // Dimensione del testo
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
