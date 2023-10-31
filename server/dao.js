"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require("sqlite3");

// Open the database
const db = new sqlite.Database(process.env.TEST_DB ? ":memory:" : "database.db", (err) => {
    if (err) throw err;
});

exports.getDatabaseInstance = () => {
    return db;
};

/***QUERY***/

/**
 * Retrieves the minimum ticket number for a specified queue
 *
 * @param {string} queueName - The name of the queue for which to get the minimum ticket number.
 * @returns {Promise<{ count: number }>} A promise that resolves with an object containing the ticket number.
 * @throws {Error} If there is an issue with the database query or connection.
 */
exports.getTicketNumber = (queueName) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MIN(ticketNumber) AS minTicketNumber FROM queues WHERE queue = ? ";
        db.get(sql, [queueName], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(row)
            const count = { count: row.minTicketNumber };
            resolve(count);
        });
    });
};

/**
 * Updates statistics for a specified queue by incrementing the count of customers for the current date.
 *
 * @param {string} queueName - The name of the queue to update statistics for.
 * @returns {Promise<string>} A promise that resolves with a message indicating whether a row was updated or a new row was created.
 * @throws {Error} If there is an issue with the database operation.
 */
exports.updateStatistics = (queueName) => {
    console.log('f')
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        console.log('today' + today)
        // Check if a row for the current date and queue exists
        const checkQuery = `
          SELECT * FROM statistics
          WHERE date = ? AND queue = ?
      `.replace(/\s+/g, ' ').trim();
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
              `.replace(/\s+/g, ' ').trim();
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
              `.replace(/\s+/g, ' ').trim();
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


/**
 * Updates the queue by deleting the last served customer from a specified queue
 *
 * @param {string} name - The name of the queue from which to remove the served customer.
 * @returns {Promise<{ numRowUpdated: number }>} A promise that resolves with an object containing the number of rows updated.
 * @throws {Error} If there is an issue with the database operation.
 */
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
`.replace(/\s+/g, ' ').trim();
        db.run(sql, [name], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ numRowUpdated: this.changes });
        });
    });
}

/**
 * Retrieves the last ticket number for a specified queue on the current date.
 *
 * @param {string} queue - The name of the queue for which to retrieve the last ticket number.
 * @returns {Promise<{ count: number }>} A promise that resolves with an object containing the last ticket number.
 * @throws {Error} If there is an issue with the database query or connection.
 */
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
                reject(err);
                return;
            } else {
                console.log(row)
                let count = { count: row.maxTicketNumber }
                resolve(count);
                return;
            }
        })
    })
}

/**
 * Retrieves the length of a specified queue
 *
 * @param {string} queue - The name of the queue for which to get the length.
 * @returns {Promise<number>} A promise that resolves with the length of the queue.
 */
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

/**
 * Adds a new ticket to a specified queue
 *
 * @param {string} queue - The name of the queue to which the ticket will be added.
 * @param {number} ticket - The ticket number to be added to the queue.
 * @returns {Promise<void>} A promise that resolves when the ticket is successfully added.
 * @param {Error} An error object if there is an issue with the database operation.
 */
exports.addTicket = (queue, ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO queues (queue, ticketNumber) VALUES (?,?)'
        db.run(sql, [queue, ticket], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
            return;
        })
    })
}

/**
 * Retrieves the last ticket number for all queues
 *
 * @returns {Promise<Array>} A promise that resolves with an array of objects, where each object represents
 *                          a queue and its last ticket number in this format { queue: string, total: number }.
 * @throws {Error} If there is an issue with the database query or connection.
 */
exports.getLastTicketAll = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT queue, MAX(ticketNumber) AS total FROM queues GROUP BY queue";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    }); 
}

/**
 * Resets the total count of queues
 *
 * @returns {Promise<number>} A promise that resolves with the number of rows affected (changes) after the deletion.
 * @rejects {Error} If there is an error during the deletion operation.
 */
exports.resetQueuesTotal = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM queues";
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(this.changes);
            }
            
        });
    }); 
}