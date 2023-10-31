# SoftEng2-group13

## Note

- The files `server/database_initializer.js` and `server/database_original.db` are useful only during the development: they are NOT artifact to be delivered to the customers

## API server

- GET THE NEW TICKET
* HTTP method: `POST` URL: `/api/ticket`
* Description: Insert and get a new ticket 
* Request body: 'queue' name
* Response: `200 OK` (success)
* Response body: The new ticket:
``` json

```

- GET LAST TICKET
* HTTP method: `GET` URL: `/api/getlast?queue=${name}`
* Description: Get last customer number
* Response: `200 OK` (success)
* Response body: Last ticket
```
    { count : number }
```

- UPDATE QUEUE COUNT / CALL NEXT CUSTOMER
* HTTP method: `PUT` URL: `/api/counter`
* Description: Delete last served
* Request body: 'queue' name
* Response: `200 OK` (success)
* Response body: 
``` 
    { numRowUpdated: number }
```
