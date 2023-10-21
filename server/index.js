"use strict";



const express = require("express");
const dao = require("./dao");           // module for accessing the DB


const app = express();
const port = 3001;



app.use(express.json());



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})