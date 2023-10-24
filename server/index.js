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

/*** Users APIs ***/
//POST /api/ticket
//This route is used for getting the ticket
app.post('/api/ticket', async (req, res) => {
    try{
        const lastTicket = await dao.getLastTicket(req.body.queue);
        const newTicket = lastTicket + 1;
        const response = await dao.addTicket(req.body.queue, newTicket); 
        return res.json(newTicket)
    } catch(err){
        res.status(503).json({ error: `Database error during the process: ${err}` }); 

    }
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})