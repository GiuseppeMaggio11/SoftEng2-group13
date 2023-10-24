"use strict";

const express = require("express");
const dao = require("./dao"); // module for accessing the DB
const morgan = require("morgan"); // logging middleware
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 3001;
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/***API***/

// GET /api/counter
app.get("/api/counter", (req, res) => {
  dao
    .getTicketNumber()
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

// PUT /api/counter
app.put(
  "/api/counter",
  [check("queue").notEmpty().withMessage("Insert a valid queue name")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const objQueue = req.body;
    console.log(JSON.stringify(objQueue))
    try {
      const numRowChanges = await dao.deleteServed(objQueue.queue);
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
