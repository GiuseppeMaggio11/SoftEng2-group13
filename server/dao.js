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
      console.log(row)
      const count = { count: row.minTicketNumber};
      resolve(count);
    });
  });
};

exports.updateStatistics = (queueName) => {
  return new Promise((resolve, reject) => {
      const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      console.log('today' + today)
      // Check if a row for the current date and queue exists
      const checkQuery = `
          SELECT * FROM statistics
          WHERE date = ? AND queue = ?
      `;
      db.get(checkQuery, [today, queueName], (err, row) => {
          if (err) {
              reject(err);
              return;
          }
          console.log(row)
          if (row) {
              // If a row exists, increment the amount by 1
              const updateQuery = `
                  UPDATE statistics
                  SET amount = amount + 1
                  WHERE date = ? AND queue = ?
              `;
              db.run(updateQuery, [today, queueName], (err) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve('Row updated');
                  }
              });
          } else {
              // If no row exists, create a new row with value 1 in the count
              const insertQuery = `
                  INSERT INTO statistics (queue, amount, date)
                  VALUES (?, 1, ?)
              `;
              db.run(insertQuery, [queueName, today], (err) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve('New row created');
                  }
              });
          }
      });
  });
}


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
}

exports.getLastTicket = (queue) => {
    const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    return new Promise ((resolve, reject) => {
        const sql = `SELECT MAX(value) AS maxTicketNumber
        FROM (
            SELECT MAX(amount) AS value
            FROM statistics
            WHERE queue = ? AND date = ?
            UNION ALL
            SELECT MAX(ticketNumber) AS value
            FROM queues
            WHERE queue = ? 
        ) AS subquery;`;
        db.get(sql,[queue, today, queue] ,(err, row) => {
            if (err) {
                reject (err);
                return;
            } else {
                console.log(row)
                let count = {count : row.maxTicketNumber}
                resolve (count);
                return;
            }
        })
    })
}

exports.getQueueLenght = (queue) => {
    return new Promise ((resolve, reject) => {
        const sql = 'SELECT count(*) AS C FROM queues WHERE queue = ?';
        db.get(sql,[queue] ,(err, row) => {
            if (err) {
                reject (err);
                return;
            } else {
                resolve (row.C);
                return;
            }
        })
    })
}

exports.addTicket = (queue, ticket) => {
    return new Promise ((resolve, reject) => {
        const sql = 'INSERT INTO queues (queue, ticketNumber) VALUES (?,?)'
        db.run(sql, [queue, ticket], function(err) {
            if(err){
                reject(err);
                return;
            } 
            resolve();
            return;
        })
    })
}
