"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require("sqlite3");

// Open the database
const db = new sqlite.Database("database.db", (err) => {
  if (err) throw err;
});

/***QUERY***/

// get ticket number
exports.getTicketNumber = (queueName) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT MIN(ticketNumber) AS minTicketNumber FROM queues WHERE queue = ? ";
    db.get(sql, [queueName], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      const count = { count: row.minTicketNumber};
      resolve(count);
    });
  });
};

// update queue count
exports.deleteServed = (name) => {
  console.log(name)
  return new Promise((resolve, reject) => {
    const sql = `
    DELETE FROM queues
    WHERE id = (
        SELECT id
        FROM queues
        WHERE queue = ?
        ORDER BY ticketNumber
        LIMIT 1
    )
`;
    db.run(sql, [name], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ numRowUpdated: this.changes });
    });
  });
};

