const AWS = require('aws-sdk');

function createDdbClient(region) {
  AWS.config.update({region: region});

  return new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
};

async function ddbQuery(region, params) {
  console.log("ddb.query", params);

  const ddbClient = createDdbClient(region);

  return new Promise((resolve, reject) => {
    ddbClient.query(params, (err, data) => {
      if (err) {
        console.error(`ddb.query(${JSON.stringify(params)}) Error`, err);

        reject(err);
      } else {
        console.log(`ddb.query(${JSON.stringify(params)}) Success`, data);

        resolve(data);
      }
    });
  });
};

async function ddbPut(region, params) {
  console.log("ddb.put", params);

  const ddbClient = createDdbClient(region);

  return new Promise((resolve, reject) => {
    ddbClient.put(params, (err, data) => {
      if (err) {
        console.error(`ddb.put(${JSON.stringify(params)}) Error`, err);

        reject(err);
      } else {
        console.log(`ddb.put(${JSON.stringify(params)}) Success`, data);

        resolve(data);
      }
    });
  });
};

async function ddbUpdate(region, params) {
  console.log("ddb.update", params);

  const ddbClient = createDdbClient(region);

  return new Promise((resolve, reject) => {
    ddbClient.update(params, (err, data) => {
      if (err) {
        console.error(`ddb.update(${JSON.stringify(params)}) Error`, err);

        reject(err);
      } else {
        console.log(`ddb.update(${JSON.stringify(params)}) Success`, data);

        resolve(data);
      }
    });
  });
};

async function ddbDelete(region, params) {
  console.log("ddb.delete", params);

  const ddbClient = createDdbClient(region);

  return new Promise((resolve, reject) => {
    ddbClient.delete(params, (err, data) => {
      if (err) {
        console.error(`ddb.delete(${JSON.stringify(params)}) Error`, err);

        reject(err);
      } else {
        console.log(`ddb.delete(${JSON.stringify(params)}) Success`, data);

        resolve(data);
      }
    });
  });
};

const axios = require('axios');
const sendGQL = (url, data, apiKey) => {
  console.log(`sendGQL ${url} : ${JSON.stringify(data)}`);

  return axios({
    url,
    method: 'post',
    headers: {
      'x-api-key': apiKey
    },
    data,
  });
};

module.exports = {
  ddbQuery,
  ddbPut,
  ddbUpdate,
  ddbDelete,
  sendGQL,
};
