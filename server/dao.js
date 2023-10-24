"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require('sqlite3');



// Open the database
const db = new sqlite.Database("database.db", (err) => {
    if (err) throw err;
});

exports.getLastTicket = (queue) => {
    return new Promise ((resolve, reject) => {
        const sql = 'SELECT MAX(ticketNumber) FROM queues WHERE queue = ?';
        db.get(sql,[queue] ,(err, rows) => {
            if (err) {
                reject (err);
                return;
            } else {
                resolve (rows);
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