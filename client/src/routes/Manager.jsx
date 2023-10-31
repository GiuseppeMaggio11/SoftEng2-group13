import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import API from "../API";


function Manager() {
    const [queueTotals, setQueueTotals] = useState([]);
    const [dirtyTotals, setDirtyTotals] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");



    function handleError(err) {
        //console.log('err: ' + JSON.stringify(err));  // Only for debug
        let errMsg = "Errore sconosciuto";
        if (err.errors) {
            if (err.errors[0])
                if (err.errors[0].msg)
                    errMsg = err.errors[0].msg;
        } else if (err.error) {
            errMsg = err.error;
        }
        setErrorMsg(errMsg);
    }


    useEffect(() => {
        /**
         * Fetches and updates queue totals
         */
        if (dirtyTotals == true) {
            API.getTotals()
                .then((totals) => {
                    setQueueTotals(totals);
                    setDirtyTotals(false);
                })
                .catch((err) => handleError(err));
        }
    }, [dirtyTotals]);


    /**
     * Resets queue totals
     */
    const resetTotals = () => {
        setQueueTotals(oldList => oldList.map(element => Object.assign({}, element, { updated: true })));
        API.resetQueuesTotal()
            .then(() => setDirtyTotals(true))
            .catch((err) => handleError(err));
    }


    return (
        <>
            {errorMsg ? <Alert variant='danger' style={{ margin: "1rem" }} dismissible onClose={() => setErrorMsg("")}>
                {errorMsg}</Alert> : null}
            <div style={{ marginRight: "15rem", marginLeft: "15rem", marginTop: "10rem" }}>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Queue name</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...queueTotals].sort((a, b) => a.queue.localeCompare(b.queue))
                                .map((e, index) => {
                                    let statusClass = e.updated ? "table-warning" : "";

                                    return (
                                        <tr key={index} className={statusClass}>
                                            <td>{e.queue}</td>
                                            <td>{e.total}</td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </Table>
                <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <Col className="d-flex justify-content-center">
                        <Button variant="primary" onClick={resetTotals}>Reset totals</Button>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Manager
