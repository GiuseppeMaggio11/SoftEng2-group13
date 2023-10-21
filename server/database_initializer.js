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

function createTable () {
    return new Promise ( (resolve,reject) => {
        const query = `CREATE TABLE "queues" (
            "id"	INTEGER NOT NULL,
            "queue"	TEXT UNIQUE NOT NULL,
            "count"	INTEGER NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}

function populate_table (queue, count) {
    return new Promise ( (resolve,reject) => {
        const query = "INSERT INTO queues(queue, count) VALUES(?,?)";
        db.run(query, [queue, count], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log("Inserted"));
        });
    }); 
}



async function initialize () {
    try {
        await dropTable("queues");
        await createTable();
        await populate_table("Q1", 0);
    }
    catch (err) {
        console.log(err)
    }
}

initialize();
