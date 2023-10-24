import { useEffect, useState } from "react";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";

function CounterOfficier() {
  const [number, setNumber] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const num = await API.getTicketNumber();
        setNumber(num);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    getTicketNumber();
  }, []);

  const handleIncreaseCount = () => {
    //API call the next one
    API.updateQueueCount('Q1')
      .then((objCount) => {
        setNumber(objCount);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="text-center">
      <h2>Currently serving</h2>
      <Row>
        <Col>
          <Button
            variant="danger" // Puoi scegliere il colore che preferisci
            style={{
              width: "80%", // Imposta la larghezza al 100% del contenitore
              height: "80%", // Imposta l'altezza al 100% del contenitore
              borderRadius: "100%", // Rendi il pulsante circolare
            }}
            onClick={handleIncreaseCount}
          >
            <span
              style={{ fontWeight: "bold", fontSize: "30px", color: "black" }}
            >
              Call next customer
            </span>
          </Button>
        </Col>
        <Col>
          {error ? <ErrorComp /> : number.count!=null?<NumberDisplay number={number.count}/>:<AllServed/>}
        </Col>
      </Row>
    </Container>
  );
}

const NumberDisplay = ({ number }) => {
  const numberStyle = {
    fontWeight: "bold", // Grassetto
    color: "black", // Colore specificato
    display: "flex",
    justifyContent: "center", // Allinea orizzontalmente al centro
    alignItems: "center", // Allinea verticalmente al centro
    height: "80vh", // Altezza della viewport
    fontSize: "200px",
  };

  return <div style={numberStyle}>{number}</div>;
};
const AllServed = ({ number }) => {
  const numberStyle = {
    fontWeight: "bold", // Grassetto
    color: "black", // Colore specificato
    display: "flex",
    justifyContent: "center", // Allinea orizzontalmente al centro
    alignItems: "center", // Allinea verticalmente al centro
    height: "80vh", // Altezza della viewport
    fontSize: "50px",
  };

  return <div style={numberStyle}>all the cutomer are served</div>
};

export default CounterOfficier;
