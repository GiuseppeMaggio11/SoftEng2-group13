const dao = require('../dao');
const sqlite = require("sqlite3");



beforeEach(() => {
    jest.clearAllMocks();
});



describe("getTicketNumber", () => {

    test("Should return a valid ticket number", async () => {
        const mockRow = { minTicketNumber: 42 };
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, mockRow);
        });

        const result = await dao.getTicketNumber("QTest");

        expect(mockGet).toHaveBeenCalledWith(
            "SELECT MIN(ticketNumber) AS minTicketNumber FROM queues WHERE queue = ? ",
            ["QTest"],
            expect.any(Function)
        );

        expect(result).toEqual({ count: 42 });
    });



    test("Should reject with an error if the database query fails", async () => {
        const mockError = new Error("Error");
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.getTicketNumber("QTest")).rejects.toThrowError(mockError);
    });

});



describe("updateStatistics", () => {

    test("Should update statistics for an existing row", async () => {
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, { mockRow: "Mock" });
        });
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(null, { mockRow: "Mock" });
        });

        const result = await dao.updateStatistics("QTest");

        expect(mockGet).toHaveBeenCalledWith(
            "SELECT * FROM statistics WHERE date = ? AND queue = ?",
            [new Date().toISOString().slice(0, 10), "QTest"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            "UPDATE statistics SET amount = amount + 1 WHERE date = ? AND queue = ?",
            [new Date().toISOString().slice(0, 10), "QTest"],
            expect.any(Function)
        );

        expect(result).toEqual("Row updated");
    });



    test("Should create a new row for non-existing date and queue", async () => {
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, undefined);
        });
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(null, { mockRow: "Mock" });
        });

        const result = await dao.updateStatistics("QTest");

        expect(mockGet).toHaveBeenCalledWith(
            "SELECT * FROM statistics WHERE date = ? AND queue = ?",
            [new Date().toISOString().slice(0, 10), "QTest"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            "INSERT INTO statistics (queue, amount, date) VALUES (?, 1, ?)",
            ["QTest", new Date().toISOString().slice(0, 10)],
            expect.any(Function)
        );

        expect(result).toEqual("New row created");
    });



    test("Should reject with an error if the database query fails when searching for a row (or a dataabase error occurres)", async () => {
        const mockError = new Error("Error");
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(null, { mockRow: "Mock" });
        });

        await expect(dao.updateStatistics("QTest")).rejects.toThrowError(mockError);
        expect(mockGet).toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();

    });



    test("Should reject with an error if the database query fails when updating a row (or a database error occurres)", async () => {
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, { mockRow: "Mock" });
        });
        const mockError = new Error("Error");
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.updateStatistics("QTest")).rejects.toThrowError(mockError);
        expect(mockGet).toHaveBeenCalled();
        expect(mockRun).toHaveBeenCalled();
    });



    test("Should reject with an error if the database query fails when inserting a new row (or a database error occurres)", async () => {
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, undefined);
        });
        const mockError = new Error("Error");
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.updateStatistics("QTest")).rejects.toThrowError(mockError);
        expect(mockGet).toHaveBeenCalled();
        expect(mockRun).toHaveBeenCalled();
    });

});



describe("deleteServed", () => {

    test("Should delete a served item from the queues table", async () => {
        const mockThis = { changes: 3 };
        const mockResult = { numRowUpdated: 3 }
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation(function (sql, params, callback) {
            callback.call(mockThis, null);
        });

        const result = await dao.deleteServed("QTest");

        expect(mockRun).toHaveBeenCalledWith(
            `
                DELETE FROM queues
                WHERE id = (
                    SELECT id
                    FROM queues
                    WHERE queue = ?
                    ORDER BY ticketNumber
                    LIMIT 1
                )
            `.replace(/\s+/g, ' ').trim(),
            ["QTest"],
            expect.any(Function)
        );

        expect(result).toEqual(mockResult);
    });



    test("Should reject with an error if the database query fails", async () => {
        const mockError = new Error("Error");
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(mockError);
        });

        await expect(dao.deleteServed("QTest")).rejects.toThrowError(mockError);
        expect(mockRun).toHaveBeenCalled();
    });

});


describe("getQueLenght", ()=> {
    test("Should return a valid queue lenght", async()=> {
        const mockRes = 5;
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, { C: mockRes });
        });

        const result = await(dao.getQueueLenght("QTest"));

        expect(mockGet).toHaveBeenCalledWith(
            "SELECT count(*) AS C FROM queues WHERE queue = ?",
            ["QTest"],
            expect.any(Function)
        );
        expect(result).toEqual(mockRes);

    })

    test("Should reject with an error if the database query fails", async () => {
        const mockError = new Error("Error");
        const mockGet = jest.spyOn(sqlite.Database.prototype, "get");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.getQueueLenght("QTest")).rejects.toThrowError(mockError);
    });

})

describe("newCustomer", ()=>{

    test("Should return a valid ticket number", async () => {
        const mockRow = {queue: "Q1" ,total: 42 };
        const mockAll = jest.spyOn(sqlite.Database.prototype, "all");
        mockAll.mockImplementation((sql, params, callback) => {
            callback(null, mockRow);
        });

        const result = await dao.getLastTicketAll();

        expect(mockAll).toHaveBeenCalledWith(
            "SELECT queue, MAX(ticketNumber) AS total FROM queues GROUP BY queue",
            [],
            expect.any(Function)
        );

        expect(result).toEqual({ queue: "Q1" ,total: 42});
    });

    test("Should reject with an error if the database query fails", async () => {
        const mockError = new Error("Error");
        const mockGet = jest.spyOn(sqlite.Database.prototype, "all");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.getLastTicketAll()).rejects.toThrowError(mockError);
    });

    test("Should create a new row for new ticket number ", async () => {

        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(null);
        });

        const result = await dao.addTicket("QTest", 4);

        expect(mockRun).toHaveBeenCalledWith(
            'INSERT INTO queues (queue, ticketNumber) VALUES (?,?)',
            ["QTest", 4 ],
            expect.any(Function)
        );

        expect(result).toEqual();
    });

    test("Should reject with an error if the database query fails when inserting a new row (or a database error occurres)", async () => {
        const mockError = new Error("Error");
        const mockRun = jest.spyOn(sqlite.Database.prototype, "run");
        mockRun.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.addTicket("QTest", 4)).rejects.toThrowError(mockError);
        expect(mockRun).toHaveBeenCalled();
    });





})



describe("getLastTicket", ()=> {
    test("Should return a valid ticket number", async () => {
        const mockRow = {queue: "Q1" ,total: 42 };
        const mockAll = jest.spyOn(sqlite.Database.prototype, "all");
        mockAll.mockImplementation((sql, params, callback) => {
            callback(null, mockRow);
        });

        const result = await dao.getLastTicketAll();

        expect(mockAll).toHaveBeenCalledWith(
            "SELECT queue, MAX(ticketNumber) AS total FROM queues GROUP BY queue",
            [],
            expect.any(Function)
        );

        expect(result).toEqual({ queue: "Q1" ,total: 42});
    });

    test("Should reject with an error if the database query fails", async () => {
        const mockError = new Error("Error");
        const mockGet = jest.spyOn(sqlite.Database.prototype, "all");
        mockGet.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });

        await expect(dao.getLastTicketAll()).rejects.toThrowError(mockError);
    });

})
