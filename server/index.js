"use strict";

const express = require("express");
const dao = require("./dao"); // module for accessing the DB
const morgan = require("morgan"); // logging middleware
const cors = require("cors");
const { check, validationResult } = require("express-validator");
//socket
const { WebSocketServer, WebSocket } = require("ws");
const { v4: uuidv4 } = require("uuid");
const http = require("http");

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const portSocket = 8000;
server.listen(portSocket, () => {
  console.log(`WebSocket server is running on port ${portSocket}`);
});

// I'm maintaining all active connections in this object
const clients = {};

// A new client connection request received
wsServer.on("connection", function (connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
});

const broadcastMessage = (msg) => {
  // We are sending the current data to all connected active clients
  //console.log(msg);
  const data = JSON.stringify(msg);
  for (let userId in clients) {
    let client = clients[userId];
    //console.log(client.readyState);
    //console.log(WebSocket);
    if (client.readyState === WebSocket.OPEN) {
      console.log("invio");
      client.send(data);
    }
  }
};

const app = express();
app.use(morgan("dev"));
app.use(express.json());
const port = 3001;
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/***API***/

// GET /api/getfirst
app.get("/api/getfirst", (req, res) => {
  const queueName = req.query.queue;
  //console.log(queueName);
  if (!queueName) {
    return res
      .status(400)
      .json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getTicketNumber(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

// PUT /api/counter
app.put(
  "/api/counter",
  [check("queue").notEmpty().withMessage("Inserisci un nome di coda valido")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const objQueue = req.body;
    try {
      const numRowChanges = await dao.deleteServed(objQueue.queue);
      // console.log(numRowChanges);
      // Notifica il client React che l'operazione è stata completata con successo
      if (numRowChanges.numRowUpdated === 1) {
        // console.log("Messaggio");
        // io.emit("databaseChange", "Operazione completata con successo");
        broadcastMessage(true);
      }

      const objCount = await dao.getTicketNumber(objQueue.queue);
      // Aggiungi +1 alle statistiche;
      res.json(objCount);
    } catch (err) {
      res.status(503).json({
        error: `Errore del database durante l'aggiornamento del conteggio della coda ${objQueue.queue}.`,
      });
    }
  }
);

app.post("/api/updateStatistics", async (req, res) => {
  const queueName = req.body.queue;
  try {
    const result = await dao.updateStatistics(queueName);
    res.json({ message: result });
  } catch (error) {
    res
      .status(503)
      .json({ error: "Database error while updating statistics." });
  }
});

/*** Users APIs ***/
//POST /api/ticket
//This route is used for getting the ticket
app.post("/api/ticket", async (req, res) => {
  try {
    const objLastTicket = await dao.getLastTicket(req.body.queue);
    const newTicket = objLastTicket.count + 1;
    //console.log(objLastTicket.count);
    // CHECK THE RESPONSE!
    const response = await dao.addTicket(req.body.queue, newTicket);
    return res.json(newTicket);
  } catch (err) {
    res
      .status(503)
      .json({ error: `Database error during the process: ${err}` });
  }
});

app.get("/api/getlast", (req, res) => {
  const queueName = req.query.queue;
  // console.log(queueName);
  if (!queueName) {
    return res
      .status(400)
      .json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getLastTicket(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

app.get("/api/getlenght", (req, res) => {
  const queueName = req.query.queue;
  if (!queueName) {
    return res
      .status(400)
      .json({ error: "Missing 'queue' parameter in query string" });
  }

  dao
    .getQueueLenght(queueName)
    .then((count) => res.json(count))
    .catch(() => res.status(500).end());
});

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

app.get("/api/totals", (req, res) => {
  dao.getLastTicketAll()
      .then(count => res.status(200).json(count))
      .catch((err) => res.status(500).json(err));
});

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
