"use strict";



const express = require("express");
const dao = require("./dao");           // module for accessing the DB


const app = express();
const port = 3001;



app.use(express.json());



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