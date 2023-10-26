"use strict";

const express = require("express");
const dao = require("./dao"); // module for accessing the DB
const morgan = require("morgan"); // logging middleware
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/***API***/

/**
 * GET /api/getfirst
 * Retrieves the ticket number of the specified queue
 */
app.get("/api/getfirst", (req, res) => {
  const queueName = req.query.queue;
 console.log(queueName)
  if (!queueName) {
    return res.status(400).json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getTicketNumber(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

/**
 * PUT /api/counter
 * Updates the queue count
 */
app.put(
  "/api/counter",
  [check("queue").notEmpty().withMessage("Insert a valid queue name")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const objQueue = req.body;
    try {
      const numRowChanges = await dao.deleteServed(objQueue.queue);
      if(numRowChanges>1)
       throw err;
      const objCount = await dao.getTicketNumber(objQueue.queue);
      //add +1 to statistics;
      res.json(objCount);
    

    } catch (err) {
      res.status(503).json({
        error: `Database error during the update of queue count ${objQueue.queue}.`,
      });
    }
  }
);

/**
 * POST /api/updateStatistics
 * Updates the statistics for the specified queue
 */
app.post("/api/updateStatistics", async (req, res) => {
  const queueName = req.body.queue; 
  try {
      const result = await dao.updateStatistics(queueName);
      res.json({ message: result });
  } catch (error) {
      res.status(503).json({ error: "Database error while updating statistics." });
  }
});



/*** Users APIs ***/
//POST /api/ticket
//Generates a ticket
app.post('/api/ticket', async (req, res) => {
    try{
        const objLastTicket = await dao.getLastTicket(req.body.queue);
        const newTicket = objLastTicket.count + 1;
        console.log(objLastTicket.count )
        // CHECK THE RESPONSE!
        const response = await dao.addTicket(req.body.queue, newTicket); 
        return res.json(newTicket)
    } catch(err){
        res.status(503).json({ error: `Database error during the process: ${err}` }); 

    }
})

/**
 * GET /api/getlast
 * Retrieves the last ticket number of the specified queue
 */
app.get("/api/getlast", (req, res) => {
  const queueName = req.query.queue;
 console.log(queueName)
  if (!queueName) {
    return res.status(400).json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getLastTicket(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

/**
 * GET /api/getlenght
 * Retrieves the length of the specified queue
 */
app.get("/api/getlenght", (req, res) => {
  const queueName = req.query.queue;
  if (!queueName) {
    return res.status(400).json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getQueueLenght(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

/**
 * GET /api/totals
 * Retrieves queue totals
 */
app.get("/api/totals", (req, res) => {
  dao.getLastTicketAll()
      .then(count => res.status(200).json(count))
      .catch((err) => res.status(500).json(err));
});

/**
 * PUT /api/reset
 * Reset queue totals
 */
app.put("/api/reset", async (req, res) => {
  try {
      const result = await dao.resetQueuesTotal();
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
});
