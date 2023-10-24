"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require("sqlite3");

// Open the database
const db = new sqlite.Database("database.db", (err) => {
  if (err) throw err;
});

/***QUERY***/

// get ticket number
exports.getTicketNumber = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT count FROM queues WHERE ID = 1";
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      const count = { count: row.count };
      resolve(count);
    });
  });
};

// update queue count
exports.updateCount = (objQueue) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE queues SET count = count + 1 WHERE ID = ?";
    db.run(sql, [objQueue.queue], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ numRowUpdated: this.changes });
    });
  });
};
