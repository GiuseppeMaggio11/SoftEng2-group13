import { useEffect, useState } from "react";
import API from "../API";
import ErrorComp from "../OtherComponents/ErrorComp";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";

function CounterOfficier() {
  const [number, setNumber] = useState({});
  const [error, setError] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
/*
  useEffect(() => {
    const getTicketNumber = async () => {
      try {
        const num = await API.getTicketNumber('Q1');
        setNumber(num);
        if (num.count===null)
          setIsFirst(true)
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    getTicketNumber();
  }, []);
  */
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
  
    return isFirst?<div style={numberStyle}>Call the first customer</div>:<div style={numberStyle}>All the customers are served</div>
  };
  const handleIncreaseCount = async() => {
    //API call the next one
    if(isFirst){
      await API.getTicketNumber('Q1')
        .then((objCount)=>{
          setNumber(objCount)
          setIsFirst(false)
        }).catch((err)=>{
          setError(err);
        })
    }
    else{
      await API.updateQueueCount('Q1')
        .then((objCount) => {
          setNumber(objCount)
          if(objCount.count!=null){ 
          API.updateStatisticsCount('Q1').then((response)=>{
            console.log(response)
          })
        }})
        .catch((err) => setError(err));
    }
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

export default CounterOfficier;
