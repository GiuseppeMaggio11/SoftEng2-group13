import { Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import API from "../API";


function Manager() {
    const [queueCounter, setQueueCounter] = useState({ count: 0 });
    const [dirtyCount, setDirtyCount] = useState(true);
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
        if (dirtyCount == true) {
            API.getCount()
                .then((count) => {
                    setQueueCounter(Object.assign({}, { count: count }));
                    setDirtyCount(false);
                })
                .catch((err) => handleError(err));
        }
    }, [dirtyCount]);



    const resetCount = () => {
        setQueueCounter(Object.assign({}, { count: queueCounter.count, updated: true }));
        API.resetQueuesTotal()
            .then(() => setDirtyCount(true))
            .catch((err) => handleError(err));
    }


    return (
        <>
            {errorMsg ? <Alert variant='danger' style={{ margin: "1rem" }} dismissible onClose={() => setErrorMsg("")}>
                {errorMsg}</Alert> : null}
            <h2 className={queueCounter.updated ? "bg-warning text-black" : "bg-warning text-dark"}>Queue Counter: {queueCounter.count}</h2>
            <button onClick={resetCount}>Reset counter</button>
        </>
    );
}

export default Manager
