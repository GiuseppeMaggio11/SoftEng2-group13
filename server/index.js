"use strict";



const express = require("express");
const cors = require('cors');
const dao = require("./dao");           // module for accessing the DB


const app = express();
const port = 3001;



app.use(express.json());



const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));



app.get("/api/counter", (req, res) => {
    dao.getQueuesCounter()
        .then(count => res.status(200).json(count))
        .catch((err) => res.status(500).json(err));
})

app.put("/api/reset", async (req, res) => {
    try {
        const result = await dao.resetQueuesCounter();
        if (result.error) {
            res.status(404).json(result);
        }
        else res.status(200).json(result);
    }
    catch (err) {
        res.status(503).json(err);
    }
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})