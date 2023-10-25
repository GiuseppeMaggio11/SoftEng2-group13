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
  

  async function getTotals() {
    const response = await fetch(SERVER_URL + "totals");
    const content = await response.json();
    if (response.ok) {
        return content;
    } else {
        throw content;
    }
  }


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

  
  const API = { getTicketNumber, updateQueueCount, updateStatisticsCount, newCustomer, getLastTicket, getTotals, resetQueuesTotal};
  export default API;