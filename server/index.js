"use strict";



const express = require("express");
const dao = require("./dao");           // module for accessing the DB
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const app = express();
const port = 3001;



app.use(express.json());



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})