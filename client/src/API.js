const SERVER_URL = 'http://localhost:3001/api/';

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj =>
              reject(obj)
            ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err =>
        reject({ error: "Cannot communicate" })
      ) // connection error
  });
}



async function getCount() {
  const response = await fetch(SERVER_URL + "counter");
  const count = await response.json();
  if (response.ok) {
      return count;
  } else {
      throw count;
  }
}

async function resetQueuesCounter() {
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



const API = {
  getCount, resetQueuesCounter
};

export default API;