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

/**
 * Retrieves the ticket number for a specified queue
 *
 * @param {string} name - The name of the queue for which to get the ticket number.
 * @returns {Promise<number>} A promise that resolves with the ticket number.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function getTicketNumber(name) {
  try {
    const response = await fetch(`${SERVER_URL}getFirst?queue=${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

/**
 * Updates the queue count by sending a PUT request to the server's API.
 *
 * @param {string} name - The name of the queue to update.
 * @returns {Promise<number>} A promise that resolves with the updated queue count.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function updateQueueCount(name) {
  // call  PUT /api/counter
  try {
    const response = await fetch(SERVER_URL + "counter", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queue: name }),
    });
    const newCount = await response.json();
    console.log('response'+ JSON.stringify(response))
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

/**
 * Updates the statistics count for a specified queue
 *
 * @param {string} name - The name of the queue for which to update statistics.
 * @returns {Promise<boolean>} A promise that resolves to 'true' if the statistics are updated successfully.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function updateStatisticsCount(name) {
  try {
    const response = await fetch(SERVER_URL + "updateStatistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queue: name }),
    });
    console.log('response'+ JSON.stringify(response))
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

/**
 * Creates a new customer ticket in the specified queue
 *
 * @param {string} name - The name of the queue to add the new customer to.
 * @returns {Promise<object>} A promise that resolves with the newly created customer ticket object.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function newCustomer(name) {
  try {
    const response = await fetch(SERVER_URL + "ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queue: name }),
    });
    const newTicket = await response.json();
    if (response.ok) {
      return newTicket;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

/**
 * Retrieves the last ticket number for a specified queue
 *
 * @param {string} name - The name of the queue for which to get the last ticket number.
 * @returns {Promise<number>} A promise that resolves with the last ticket number.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function getLastTicket(name) {
  try {
    const response = await fetch(`${SERVER_URL}getlast?queue=${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

/**
 * Retrieves the length of a specified queue
 *
 * @param {string} name - The name of the queue for which to get the length.
 * @returns {Promise<number>} A promise that resolves with the length of the queue.
 * @throws {Error} If there is an issue with the API request or response.
 */
async function getQueueLenght(name) {
  try {
    const response = await fetch(`${SERVER_URL}getlenght?queue=${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const count = await response.json();

    if (response.ok) {
      return count;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

/**
 * Retrieves the total of every queue
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing totals
 * @throws {Object} If there is an issue with the API request or response, an object with error details is thrown.
 */
async function getTotals() {
  const response = await fetch(SERVER_URL + "totals", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const content = await response.json();
  if (response.ok) {
      return content;
  } else {
      throw content;
  }
}

/**
 * Reset the total of every queue
 *
 * @returns {Promise<null>} A promise that resolves with null when the reset is successful.
 * @throws {object} An error object when there is an issue with the request or server response.
 */
async function resetQueuesTotal() {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + "reset", {
      method: 'PUT'
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Cannot parse server response." }) });
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
  });
}



const API = { getTicketNumber, updateQueueCount, updateStatisticsCount, newCustomer, getLastTicket, getQueueLenght, getTotals, resetQueuesTotal};
export default API;