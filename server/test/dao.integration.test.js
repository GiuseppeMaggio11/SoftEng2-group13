const sqlite = require("sqlite3");
const dao = require('../dao');



function dropTable (table) {
    const query = `drop table if exists ${table}`;
    return new Promise ( (resolve,reject) => {
        db.run(query, [], (err,rows) => {
            if (err) reject(err);
            else resolve(console.log(`Table ${table} dropped`));
        });
    }); 
} 

function deleteContent (table) {
    const query = `DELETE FROM ${table}`;
    return new Promise ( (resolve,reject) => {
        db.run(query, [], (err) => {
            if (err) reject(err);
            else resolve(console.log(`Table ${table} is now empty`));
        });
    }); 
}


const db = dao.getDatabaseInstance();

afterAll(async () => {
    await db.close();
});



describe("getTicketNumber", () => {

    function createTable () {
        return new Promise ( (resolve,reject) => {
            const query = `CREATE TABLE "queues" (
                "id"	INTEGER NOT NULL,
                "queue"	TEXT NOT NULL,
                "ticketNumber"	INTEGER NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            )`;
            db.run(query, [], (err) => {
                if (err) reject(err, rows);
                else resolve(console.log('Table "queues" is now empty'));
            });
        }); 
    }

    function populate_table (queue, ticketNumber) {
        return new Promise ( (resolve,reject) => {
            const query = "INSERT INTO queues(queue, ticketNumber) VALUES(?,?)";
            db.run(query, [queue, ticketNumber], (err,rows) => {
                if (err) reject(err);
                else resolve(console.log("Inserted"));
            });
        }); 
    }

    /*seeAll = () => {                    //To be eliminated
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM queues";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }); 
    }*/



    beforeAll(async () => {
        await dropTable("queues");
        await createTable();
    });

    beforeEach(async () => {
        await deleteContent("queues");
    });



    test("Should return a valid ticket number", async () => {
        await populate_table("Q1", 5);
        await populate_table("Q1", 4);
        await populate_table("Q1", 3);
        await populate_table("Q2", 2);

        const result = await dao.getTicketNumber("Q1");

        expect(result).toStrictEqual({
            count: 3
        });
    });



    test.skip("Should reject with an error if the database query fails", async () => {
        expect(true).toBe(true);

        //How do I make it fail? It's like when in SE1 we had to check that it returned error 500: you can mock it but you can't force a mongo database (nor a SQLite database) to fail

    });

});



describe("updateStatistics", () => {

    function createTable () {
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

    function populate_table (queue, amount, date) {
        return new Promise ( (resolve,reject) => {
            const query = "INSERT INTO statistics(queue, amount, date) VALUES(?,?,?)";
            db.run(query, [queue, amount, date], (err,rows) => {
                if (err) reject(err);
                else resolve(console.log("Inserted"));
            });
        }); 
    }

    /*seeAll = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM statistics";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }); 
    }*/



    beforeAll(async () => {
        await dropTable("statistics");
        await createTable();
    });

    beforeEach(async () => {
        await deleteContent("statistics");
    });



    test("Should update statistics for an existing row", async () => {
        await populate_table("Q1", 5, new Date().toISOString().slice(0, 10));

        const result = await dao.updateStatistics("Q1");

        expect(result).toStrictEqual("Row updated");
    });



    test("Should create a new row for non-existing date and queue", async () => {
        const result = await dao.updateStatistics("Q1");

        expect(result).toStrictEqual("New row created");
    });



    test.skip("Should reject with an error if the database query fails when searching for a row (or a dataabase error occurres)", async () => {
        expect(true).toBe(true);

        //Same as above

    });



    test.skip("Should reject with an error if the database query fails when updating a row (or a database error occurres)", async () => {
        expect(true).toBe(true);

        //Same as above
        
    });



    test.skip("Should reject with an error if the database query fails when inserting a new row (or a database error occurres)", async () => {
        expect(true).toBe(true);

        //Same as above
        
    });

});



describe("deleteServed", () => {

    function createTable () {
        return new Promise ( (resolve,reject) => {
            const query = `CREATE TABLE "queues" (
                "id"	INTEGER NOT NULL,
                "queue"	TEXT NOT NULL,
                "ticketNumber"	INTEGER NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            )`;
            db.run(query, [], (err) => {
                if (err) reject(err, rows);
                else resolve(console.log('Table "queues" is now empty'));
            });
        }); 
    }

    function populate_table (queue, ticketNumber) {
        return new Promise ( (resolve,reject) => {
            const query = "INSERT INTO queues(queue, ticketNumber) VALUES(?,?)";
            db.run(query, [queue, ticketNumber], (err,rows) => {
                if (err) reject(err);
                else resolve(console.log("Inserted"));
            });
        }); 
    }

    /*seeAll = () => {                    //To be eliminated
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM queues";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }); 
    }*/



    beforeAll(async () => {
        await dropTable("queues");
        await createTable();
    });

    beforeEach(async () => {
        await deleteContent("queues");
    });




    test("Should delete a served item from the queues table", async () => {
        await populate_table("Q1", 5);
        await populate_table("Q1", 4);
        await populate_table("Q1", 3);

        const result = await dao.deleteServed("Q1");

        expect(result).toStrictEqual({ numRowUpdated: 1 });
    });

    test("Should not throw any error if the selected queue is empty", async () => {
        const result = await dao.deleteServed("Q1");

        expect(result).toStrictEqual({ numRowUpdated: 0 });
    });



    test.skip("Should reject with an error if the database query fails", async () => {
        expect(true).toBe(true);

        //Same as above
        
    });

});