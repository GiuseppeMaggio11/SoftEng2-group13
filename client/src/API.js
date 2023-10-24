const SERVER_URL = "http://localhost:3001/api/";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

async function getTicketNumber() {
  // call  /api/counter
  return getJson(fetch(SERVER_URL + "counter")).then((objCount) => {
    return objCount;
  });
}

async function updateQueueCount(queueNumber) {
  // call  PUT /api/counter
  try {
    const response = await fetch(SERVER_URL + "counter", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queue: queueNumber }),
    });
    const newCount = await response.json();
    if (response.ok) {
      return newCount;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

const API = { getTicketNumber, updateQueueCount };
export default API;
