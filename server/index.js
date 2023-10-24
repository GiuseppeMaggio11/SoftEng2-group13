"use strict";



const express = require("express");
const dao = require("./dao");           // module for accessing the DB
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };
  app.use(cors(corsOptions));

app.use(express.json());



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})