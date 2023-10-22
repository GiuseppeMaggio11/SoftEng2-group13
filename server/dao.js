"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require('sqlite3');



// Open the database
const db = new sqlite.Database("database.db", (err) => {
    if (err) throw err;
});



exports.getQueuesCounter = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT count FROM queues WHERE queue=\"Q1\"";
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.count);
        });
    }); 
}

exports.resetQueuesCounter = () => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE queues SET count=0 WHERE queue=\"Q1\"";
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    }); 
}