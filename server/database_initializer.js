"use strict";

//const dayjs = require("dayjs");
const sqlite = require("sqlite3");


/* Un-comment one line at a time */
const db = new sqlite.Database("database.db", (err) => {if (err) throw err;});                          //Work with this database
//const db = new sqlite.Database("database_original.db", (err) => {if (err) throw err;});

function dropTable (tabella) {
    const query = `drop table if exists ${tabella}`;
    return new Promise ( (resolve,reject) => {
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
} 

/*function createTable1 () {
    return new Promise ( (resolve,reject) => {
        const query = `CREATE TABLE sqlite_sequence(name,seq)`;
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
} */

function createTable1 () {
    return new Promise ( (resolve,reject) => {
        const query = `CREATE TABLE "queues" (
            "id"	INTEGER NOT NULL,
            "queue"	TEXT NOT NULL,
            "ticketNumber"	INTEGER NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}

function populate_table1 (queue, count) {
    return new Promise ( (resolve,reject) => {
        const query = "INSERT INTO queues(queue, count) VALUES(?,?)";
        db.run(query, [queue, count], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}

function createTable2 () {
    return new Promise ( (resolve,reject) => {
        const query = `CREATE TABLE "statistics" (
            "id"	INTEGER NOT NULL,
            "queue"	TEXT UNIQUE NOT NULL,
            "amount"    INTEGER NOT NULL,
            "date"  DATE NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}
function populate_table2 (queue, amount, date) {
    return new Promise ( (resolve,reject) => {
        const query = "INSERT INTO statistics(queue, amount, date) VALUES(?,?,?)";
        db.run(query, [queue, amount, date], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}

/*
function createTable1 () {
    return new Promise ( (resolve,reject) => {
        const query = `CREATE TABLE "queues" (
            "id"	INTEGER NOT NULL,
            "queue"	TEXT NOT NULL,
            "ticketNumber"	INTEGER NOT NULL,
            "isServed" BOOL,
            "date" DATE,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}
*/


async function initialize () {
    try {
        await dropTable("queues");
        await dropTable("statistics");
        await createTable1();
        await createTable2();
    }
    catch (err) {
        console.log(err)
    }
}

initialize();
