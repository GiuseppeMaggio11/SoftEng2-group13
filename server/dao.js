"use strict";

/* Data Access Object (DAO) per accedere a pagine e blocchi, oltre che al titolo dell'applicazione */

const sqlite = require('sqlite3');



// Open the database
const db = new sqlite.Database("database.db", (err) => {
    if (err) throw err;
});